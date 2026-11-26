import type { GithubActivity, GithubActivityProvider, GithubRepository } from "@/domain/github-activity";
import {
  commitsInLastWeek,
  hasPushToday,
  latestRepositories,
  pushStreak,
} from "@/services/github-stats";

export interface GithubSummary {
  username: string;
  avatarUrl: string;
  profileUrl: string;
  repositories: GithubRepository[];
  commitsLastWeek: number;
  streak: number;
  pushedToday: boolean;
}

export type GithubSummaryResult =
  | { status: "ok"; summary: GithubSummary }
  | { status: "nao-configurado" }
  | { status: "indisponivel" };

export async function getGithubSummary(
  provider: GithubActivityProvider,
  now: Date,
  timeZone: string,
): Promise<GithubSummaryResult> {
  let activity: GithubActivity | null;
  try {
    activity = await provider.fetchActivity();
  } catch {
    return { status: "indisponivel" };
  }
  if (!activity) return { status: "nao-configurado" };

  return {
    status: "ok",
    summary: {
      username: activity.username,
      avatarUrl: activity.avatarUrl,
      profileUrl: activity.profileUrl,
      repositories: latestRepositories(activity.repositories),
      commitsLastWeek: commitsInLastWeek(activity.pushes, now, timeZone),
      streak: pushStreak(activity.pushes, now, timeZone),
      pushedToday: hasPushToday(activity.pushes, now, timeZone),
    },
  };
}
