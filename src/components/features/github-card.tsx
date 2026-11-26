import Image from "next/image";
import { Flame, GitBranch, GitCommitHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardTitle, GlassCard } from "@/components/ui/glass-card";
import type { GithubRepository } from "@/domain/github-activity";
import { APP_TIME_ZONE } from "@/lib/app-config";
import { githubActivityProvider } from "@/lib/integrations";
import { getGithubSummary, type GithubSummary } from "@/use-cases/get-github-summary";

const SHORT_DATE = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: APP_TIME_ZONE });

const EMPTY_MESSAGES = {
  "nao-configurado": "Configure GITHUB_USERNAME no .env e na Vercel para ver sua atividade aqui.",
  indisponivel: "Não foi possível falar com o GitHub agora. Tente de novo mais tarde.",
};

function GithubFrame({ children }: { children: React.ReactNode }) {
  return (
    <GlassCard ariaLabel="Atividade no GitHub">
      <CardTitle icon={<GitBranch aria-hidden className="size-5 text-violet-300" />}>GitHub</CardTitle>
      {children}
    </GlassCard>
  );
}

function RepositoryItem({ repository }: { repository: GithubRepository }) {
  return (
    <li className="flex items-baseline justify-between gap-3 text-sm">
      <a href={repository.url} target="_blank" rel="noreferrer" className="min-w-0 truncate font-semibold text-slate-100 hover:text-violet-200">
        {repository.name}
      </a>
      <span className="shrink-0 text-xs text-slate-400">
        {repository.language ?? "—"} · {repository.pushedAt ? SHORT_DATE.format(new Date(repository.pushedAt)) : "—"}
      </span>
    </li>
  );
}

function GithubDetails({ summary }: { summary: GithubSummary }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Image src={summary.avatarUrl} alt="" width={40} height={40} className="rounded-full" />
        <a href={summary.profileUrl} target="_blank" rel="noreferrer" className="font-bold text-white hover:text-violet-200">
          {summary.username}
        </a>
        {summary.pushedToday ? (
          <Badge tone="emerald">
            Commit hoje ✓
          </Badge>
        ) : null}
      </div>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">
        <span className="inline-flex items-center gap-1">
          <GitCommitHorizontal aria-hidden className="size-4" />
          {summary.commitsLastWeek} commits em 7 dias
        </span>
        <span className="inline-flex items-center gap-1">
          <Flame aria-hidden className="size-4 text-amber-300" />
          {summary.streak} {summary.streak === 1 ? "dia seguido" : "dias seguidos"} com commit
        </span>
      </p>
      <ul className="space-y-1.5">
        {summary.repositories.map((repository) => (
          <RepositoryItem key={repository.name} repository={repository} />
        ))}
      </ul>
    </div>
  );
}

export async function GithubCard() {
  const result = await getGithubSummary(githubActivityProvider(), new Date(), APP_TIME_ZONE);

  return (
    <GithubFrame>
      {result.status === "ok" ? (
        <GithubDetails summary={result.summary} />
      ) : (
        <p className="text-sm text-slate-400">{EMPTY_MESSAGES[result.status]}</p>
      )}
    </GithubFrame>
  );
}

export function GithubCardFallback() {
  return (
    <GithubFrame>
      <div aria-hidden className="h-32 animate-pulse rounded-2xl bg-white/5" />
    </GithubFrame>
  );
}
