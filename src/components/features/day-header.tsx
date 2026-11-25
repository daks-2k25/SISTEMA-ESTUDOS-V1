import { CalendarClock, CheckCircle2, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import type { StudyDay } from "@/domain/study-day";
import {
  STUDY_DAY_KIND_LABELS,
  type StudyDayKind,
} from "@/domain/study-day-kind";
import { formatLongDate } from "@/lib/format";

const KIND_TONES: Record<StudyDayKind, "violet" | "emerald" | "amber" | "slate"> = {
  AULA: "violet",
  AVALIACAO: "amber",
  REVISAO: "emerald",
  PROJETO: "violet",
  TRILHA: "slate",
};

interface DayHeaderProps {
  day: Pick<
    StudyDay,
    | "dayNumber"
    | "sectionTitle"
    | "kind"
    | "courseLesson"
    | "topicTitle"
    | "scheduledDate"
    | "isCompleted"
  >;
}

export function DayHeader({ day }: DayHeaderProps) {
  const kindLabel =
    day.kind === "AULA" && day.courseLesson !== null
      ? "Aula " + day.courseLesson
      : STUDY_DAY_KIND_LABELS[day.kind];

  return (
    <GlassCard as="div" className="bg-linear-to-br from-violet-500/15 to-indigo-500/10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone="violet">
          <Layers3 aria-hidden className="size-3.5" />
          {day.sectionTitle}
        </Badge>
        <Badge tone={KIND_TONES[day.kind]}>{kindLabel}</Badge>
        {day.isCompleted ? (
          <Badge tone="emerald">
            <CheckCircle2 aria-hidden className="size-3.5" />
            Concluído
          </Badge>
        ) : null}
      </div>
      <p className="text-sm font-semibold text-violet-200">Dia {day.dayNumber} de 120</p>
      <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
        {day.topicTitle}
      </h1>
      <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
        <CalendarClock aria-hidden className="size-4" />
        <span className="first-letter:uppercase">{formatLongDate(day.scheduledDate)}</span>
      </p>
    </GlassCard>
  );
}
