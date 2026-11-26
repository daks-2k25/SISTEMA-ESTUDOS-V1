"use client";

import { useState, useTransition, type FormEvent } from "react";
import { ClipboardCheck, Save } from "lucide-react";
import { saveReflection } from "@/actions/study-day-actions";
import { Button } from "@/components/ui/button";
import { CardTitle, GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/cn";
import type { ScoreFeedback, ScoreStatus } from "@/services/quiz";

interface ReflectionCardProps {
  studyDayId: string;
  initialQuizScore: number | null;
  initialDifficulties: string;
  feedback: ScoreFeedback;
}

const FIELD_CLASS =
  "w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white placeholder:text-slate-400";

const STATUS_CLASS: Record<ScoreStatus, string> = {
  "sem-nota": "text-slate-300",
  abaixo: "text-amber-300",
  atingido: "text-emerald-300",
};

function statusLabel(feedback: ScoreFeedback): string {
  if (feedback.status === "sem-nota") return "Sem nota registrada";
  if (feedback.isEvaluation) return feedback.status === "atingido" ? "Aprovado" : "Reprovado";
  return feedback.status === "atingido" ? "Meta atingida" : "Abaixo da meta";
}

function targetLabel(feedback: ScoreFeedback): string {
  return feedback.isEvaluation
    ? "Nota mínima para aprovação: " + feedback.target
    : "Meta do quiz: " + feedback.target + "%";
}

function parseScore(value: FormDataEntryValue | null): number | null {
  const text = String(value ?? "").trim();
  return text === "" ? null : Number(text);
}

export function ReflectionCard({
  studyDayId,
  initialQuizScore,
  initialDifficulties,
  feedback,
}: ReflectionCardProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await saveReflection({
        studyDayId,
        quizScore: parseScore(data.get("quizScore")),
        difficulties: String(data.get("difficulties") ?? ""),
      });
      setMessage(result.ok ? "Registro salvo." : result.error);
    });
  }

  return (
    <GlassCard ariaLabel="Quiz e dificuldades">
      <CardTitle icon={<ClipboardCheck aria-hidden className="size-5 text-violet-300" />}>
        Quiz e dificuldades
      </CardTitle>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <label htmlFor="nota-quiz" className="text-sm font-semibold text-slate-200">
              Nota do quiz (0 a 100)
            </label>
            <input
              id="nota-quiz"
              name="quizScore"
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              step={1}
              defaultValue={initialQuizScore ?? ""}
              className={cn(FIELD_CLASS, "w-32")}
            />
          </div>
          <div className="pb-1 text-sm">
            <p className="text-slate-400">{targetLabel(feedback)}</p>
            <p className={cn("font-semibold", STATUS_CLASS[feedback.status])}>{statusLabel(feedback)}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="dificuldades" className="text-sm font-semibold text-slate-200">
            Dificuldades
          </label>
          <textarea
            id="dificuldades"
            name="difficulties"
            rows={3}
            maxLength={2000}
            defaultValue={initialDifficulties}
            placeholder="O que ficou difícil? O que precisa revisar?"
            className={FIELD_CLASS}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" icon={Save} size="md" loading={isPending}>
            Salvar registro
          </Button>
          {message ? (
            <p role="status" className="text-sm font-semibold text-slate-200">
              {message}
            </p>
          ) : null}
        </div>
      </form>
    </GlassCard>
  );
}
