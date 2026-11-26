import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Compass } from "lucide-react";
import { ChecklistCard } from "@/components/features/checklist-card";
import { CompleteDayCard } from "@/components/features/complete-day-card";
import { DayHeader } from "@/components/features/day-header";
import { DayNavigator } from "@/components/features/day-navigator";
import { GithubCard, GithubCardFallback } from "@/components/features/github-card";
import { LessonReminder } from "@/components/features/lesson-reminder";
import { ModuleDaysList } from "@/components/features/module-days-list";
import { ModuleFilter } from "@/components/features/module-filter";
import { NotesCard } from "@/components/features/notes-card";
import { OverdueBanner } from "@/components/features/overdue-banner";
import { ReflectionCard } from "@/components/features/reflection-card";
import { StudyContentCard } from "@/components/features/study-content-card";
import { StudySessionCard } from "@/components/features/study-session-card";
import { CardTitle, GlassCard } from "@/components/ui/glass-card";
import { APP_TIME_ZONE } from "@/lib/app-config";
import { formatDateTime } from "@/lib/format";
import { studyDayRepository } from "@/lib/repositories";
import { parseRequestedDay } from "@/services/day-selection";
import { getDashboard } from "@/use-cases/get-dashboard";

export type DashboardSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

interface DashboardSectionProps {
  searchParams: DashboardSearchParams;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function buildCanonicalPath(dayNumber: number, moduleTitle: string | null): string {
  const params = new URLSearchParams({ dia: String(dayNumber) });
  if (moduleTitle) params.set("modulo", moduleTitle);
  return "/?" + params.toString();
}

export async function DashboardSection({ searchParams }: DashboardSectionProps) {
  await connection();
  const params = await searchParams;
  const requestedDay = parseRequestedDay(firstValue(params.dia));
  const requestedModule = firstValue(params.modulo) ?? null;

  const data = await getDashboard(studyDayRepository, {
    requestedDay,
    requestedModule,
    now: new Date(),
    timeZone: APP_TIME_ZONE,
  });

  if (!data) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <GlassCard>
          <p className="text-center text-slate-300">
            Nenhum dia encontrado. Rode npm run db:setup para carregar a trilha.
          </p>
        </GlassCard>
      </main>
    );
  }

  const { day } = data;

  if (requestedDay !== day.dayNumber) {
    redirect(buildCanonicalPath(day.dayNumber, requestedModule));
  }

  const completedAtLabel = day.completedAt
    ? formatDateTime(day.completedAt, APP_TIME_ZONE)
    : null;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
      {data.hasOverdueDays ? <OverdueBanner /> : null}
      {day.kind === "AULA" ? <LessonReminder /> : null}
      <DayHeader day={day} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          <StudyContentCard
            moduleTitle={day.moduleTitle}
            topicTitle={day.topicTitle}
            summaryContent={day.summaryContent}
            keyTakeaways={day.keyTakeaways}
          />
          <NotesCard
            key={day.id}
            studyDayId={day.id}
            initialNotes={day.notes ?? ""}
          />
          <ReflectionCard
            key={"reflexao-" + day.id}
            studyDayId={day.id}
            initialQuizScore={day.quizScore}
            initialDifficulties={day.difficulties ?? ""}
            feedback={data.scoreFeedback}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <ChecklistCard
            key={day.id}
            studyDayId={day.id}
            tasks={day.checklistTasks}
          />
          <StudySessionCard
            key={day.id}
            studyDayId={day.id}
            kind={day.kind}
            initialMinutesStudied={day.minutesStudied}
          />
          <CompleteDayCard
            key={day.id}
            studyDayId={day.id}
            isCompleted={day.isCompleted}
            completedAtLabel={completedAtLabel}
            pendingTasks={data.pendingTasks}
          />
          <Suspense fallback={<GithubCardFallback />}>
            <GithubCard />
          </Suspense>
          <GlassCard ariaLabel="Navegar pelos dias">
            <CardTitle icon={<Compass aria-hidden className="size-5 text-violet-300" />}>
              Navegar
            </CardTitle>
            <div className="space-y-5">
              <DayNavigator
                previousDayNumber={data.previousDayNumber}
                nextDayNumber={data.nextDayNumber}
                moduleTitle={requestedModule}
              />
              <ModuleFilter
                moduleTitles={data.moduleTitles}
                selectedModule={data.selectedModule}
                currentDayNumber={day.dayNumber}
              />
              <ModuleDaysList
                days={data.moduleDays}
                currentDayNumber={day.dayNumber}
                moduleTitle={data.selectedModule}
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
