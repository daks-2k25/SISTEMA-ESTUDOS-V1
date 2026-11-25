import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Code2, Swords } from "lucide-react";
import { ChallengeEditor } from "@/components/features/challenge-editor";
import { ChallengeHelp } from "@/components/features/challenge-help";
import { ChallengeNavigation } from "@/components/features/challenge-navigation";
import { Badge } from "@/components/ui/badge";
import { CardTitle, GlassCard } from "@/components/ui/glass-card";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { APP_TIME_ZONE } from "@/lib/app-config";
import { dailyChallengeRepository, studyDayRepository } from "@/lib/repositories";
import { getChallengesOverview } from "@/use-cases/get-challenges-overview";

export type ChallengesSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

interface ChallengesSectionProps {
  searchParams: ChallengesSearchParams;
}

function firstValue(value: string | string[] | undefined): string | null {
  const single = Array.isArray(value) ? value[0] : value;
  return single ?? null;
}

export async function ChallengesSection({ searchParams }: ChallengesSectionProps) {
  await connection();
  const params = await searchParams;

  const requestedId = firstValue(params.desafio);

  const overview = await getChallengesOverview(
    { studyDays: studyDayRepository, challenges: dailyChallengeRepository },
    {
      requestedId,
      now: new Date(),
      timeZone: APP_TIME_ZONE,
    },
  );
  const { selected } = overview;

  if (!selected) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <GlassCard className="text-center">
          <Swords aria-hidden className="mx-auto mb-3 size-10 text-violet-300" />
          <h1 className="text-2xl font-extrabold text-white">Nenhum desafio disponível</h1>
          <p className="mt-2 text-slate-300">
            Os desafios aparecem conforme os dias são liberados ou concluídos.
          </p>
        </GlassCard>
      </main>
    );
  }

  if (requestedId !== selected.id) {
    redirect("/desafios?desafio=" + encodeURIComponent(selected.id));
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-white sm:text-3xl">
          <Code2 aria-hidden className="size-7 text-violet-300" />
          Desafio do Dia
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-6">
          <GlassCard ariaLabel="Briefing do desafio">
            <CardTitle
              action={
                selected.isCompleted ? (
                  <Badge tone="emerald">Concluído</Badge>
                ) : (
                  <Badge tone="amber">Pendente</Badge>
                )
              }
            >
              Briefing
            </CardTitle>
            <p className="text-sm font-semibold text-violet-200">
              Dia {selected.dayNumber} — {selected.topicTitle}
            </p>
            <h2 className="mt-1 mb-4 text-xl font-bold text-white">{selected.title}</h2>
            <MarkdownContent content={selected.description} />
            <div className="mt-5">
              <ChallengeHelp
                key={selected.id}
                hint={selected.hint}
                solutionCode={selected.solutionCode}
              />
            </div>
          </GlassCard>

          <GlassCard ariaLabel="Todos os desafios">
            <CardTitle>Desafios</CardTitle>
            <ChallengeNavigation
              items={overview.items}
              selectedId={selected.id}
              previousId={overview.previousId}
              nextId={overview.nextId}
            />
          </GlassCard>
        </div>

        <ChallengeEditor
          key={selected.id}
          challengeId={selected.id}
          title={selected.title}
          description={selected.description}
          initialCode={selected.userCode ?? selected.starterCode ?? ""}
          isCompleted={selected.isCompleted}
        />
      </div>
    </main>
  );
}
