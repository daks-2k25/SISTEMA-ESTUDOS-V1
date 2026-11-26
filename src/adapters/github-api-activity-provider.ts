import { cacheLife } from "next/cache";
import { z } from "zod";
import type {
  GithubActivity,
  GithubActivityProvider,
  GithubPush,
  GithubRepository,
} from "@/domain/github-activity";
import { readIntegrationsConfig } from "@/lib/integrations-config";

const GITHUB_API = "https://api.github.com";
const RECENT_REPOSITORIES = 5;
const EVENTS_PAGE_SIZE = 100;

const userSchema = z.object({
  login: z.string(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
});

const repositorySchema = z.object({
  name: z.string(),
  html_url: z.string().url(),
  language: z.string().nullable(),
  pushed_at: z.string().nullable(),
});

const eventSchema = z.object({
  type: z.string(),
  created_at: z.string(),
  payload: z
    .object({
      size: z.number().optional(),
      commits: z.array(z.unknown()).optional(),
    })
    .passthrough(),
});

function githubHeaders(): HeadersInit {
  const token = readIntegrationsConfig().GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "devjr120-app",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: "Bearer " + token } : {}),
  };
}

async function fetchGithubJson(path: string): Promise<unknown> {
  "use cache";
  cacheLife("hours");

  const response = await fetch(GITHUB_API + path, { headers: githubHeaders() });
  if (!response.ok) throw new Error("A API do GitHub respondeu " + response.status);
  return response.json();
}

function toRepository(repository: z.infer<typeof repositorySchema>): GithubRepository {
  return {
    name: repository.name,
    url: repository.html_url,
    language: repository.language,
    pushedAt: repository.pushed_at ?? "",
  };
}

function toPushes(events: z.infer<typeof eventSchema>[]): GithubPush[] {
  return events
    .filter((event) => event.type === "PushEvent")
    .map((event) => ({
      createdAt: event.created_at,
      commits: event.payload.size ?? event.payload.commits?.length ?? 1,
    }));
}

async function loadActivity(username: string): Promise<GithubActivity> {
  const userPath = "/users/" + encodeURIComponent(username);
  const [user, repositories, events] = await Promise.all([
    fetchGithubJson(userPath),
    fetchGithubJson(userPath + "/repos?sort=pushed&per_page=" + RECENT_REPOSITORIES),
    fetchGithubJson(userPath + "/events/public?per_page=" + EVENTS_PAGE_SIZE),
  ]);

  const profile = userSchema.parse(user);
  return {
    username: profile.login,
    avatarUrl: profile.avatar_url,
    profileUrl: profile.html_url,
    repositories: z.array(repositorySchema).parse(repositories).map(toRepository),
    pushes: toPushes(z.array(eventSchema).parse(events)),
  };
}

export function createGithubActivityProvider(username: string | undefined): GithubActivityProvider {
  return {
    fetchActivity: () => (username ? loadActivity(username) : Promise.resolve(null)),
  };
}
