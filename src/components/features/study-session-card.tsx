"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { CheckCircle2, Clock, Pause, Play, PlusCircle, RotateCcw } from "lucide-react";
import { addStudyMinutes } from "@/actions/study-day-actions";
import { Button } from "@/components/ui/button";
import { CardTitle, GlassCard } from "@/components/ui/glass-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Timer } from "@/components/ui/timer";
import { cn } from "@/lib/cn";
import {
  SESSION_TOTAL_SECONDS,
  formatClock,
  getSessionPlan,
  getSessionState,
  wholeMinutesToRecord,
} from "@/services/study-session";
import { STUDY_DAY_KIND_LABELS, type StudyDayKind } from "@/domain/study-day-kind";

const TICK_INTERVAL_MS = 500;
const QUICK_MINUTES = 15;

function computeElapsedSeconds(
  baseSeconds: number,
  startedAt: number | null,
): number {
  if (startedAt === null) return baseSeconds;
  return baseSeconds + (Date.now() - startedAt) / 1000;
}

interface StudySessionCardProps {
  studyDayId: string;
  kind: StudyDayKind;
  initialMinutesStudied: number;
}

export function StudySessionCard({
  studyDayId,
  kind,
  initialMinutesStudied,
}: StudySessionCardProps) {
  const plan = getSessionPlan(kind);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [totalMinutes, setTotalMinutes] = useState(initialMinutesStudied);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const baseSecondsRef = useRef(0);
  const startedAtRef = useRef<number | null>(null);
  const recordedSecondsRef = useRef(0);

  const session = getSessionState(plan, elapsedSeconds);

  function recordMinutes(minutes: number, onFailure?: () => void) {
    startTransition(async () => {
      const result = await addStudyMinutes({ studyDayId, minutes });
      if (result.ok) {
        setTotalMinutes(result.data.minutesStudied);
        setError(null);
        return;
      }
      onFailure?.();
      setError(result.error);
    });
  }

  function persistElapsed(seconds: number) {
    const minutes = wholeMinutesToRecord(seconds, recordedSecondsRef.current);
    if (minutes < 1) return;
    recordedSecondsRef.current += minutes * 60;
    recordMinutes(minutes, () => {
      recordedSecondsRef.current -= minutes * 60;
    });
  }

  function stopAt(seconds: number) {
    baseSecondsRef.current = seconds;
    startedAtRef.current = null;
    setElapsedSeconds(seconds);
    setRunning(false);
    persistElapsed(seconds);
  }

  function handleStart() {
    startedAtRef.current = Date.now();
    setRunning(true);
  }

  function handlePause() {
    stopAt(computeElapsedSeconds(baseSecondsRef.current, startedAtRef.current));
  }

  function handleReset() {
    baseSecondsRef.current = 0;
    startedAtRef.current = null;
    recordedSecondsRef.current = 0;
    setElapsedSeconds(0);
    setRunning(false);
  }

  const stopAtRef = useRef(stopAt);

  useEffect(() => {
    stopAtRef.current = stopAt;
  });

  useEffect(() => {
    if (!running) return;
    const timerId = setInterval(() => {
      const seconds = computeElapsedSeconds(
        baseSecondsRef.current,
        startedAtRef.current,
      );
      if (seconds >= SESSION_TOTAL_SECONDS) {
        stopAtRef.current(SESSION_TOTAL_SECONDS);
        return;
      }
      setElapsedSeconds(seconds);
    }, TICK_INTERVAL_MS);
    return () => clearInterval(timerId);
  }, [running]);

  const sessionPercentage = (elapsedSeconds / SESSION_TOTAL_SECONDS) * 100;

  return (
    <GlassCard ariaLabel="Sessão de estudo de 60 minutos">
      <CardTitle icon={<Clock aria-hidden className="size-5 text-violet-300" />}>
        Sessão de 60 min
      </CardTitle>
      <p className="-mt-2 mb-4 text-sm text-slate-300">
        Plano para {STUDY_DAY_KIND_LABELS[kind].toLowerCase()}
      </p>

      <ol className="mb-5 grid grid-cols-3 gap-2" aria-label="Etapas da sessão">
        {plan.map((stage, index) => {
          const isCurrent = index === session.stageIndex && !session.finished;
          const isDone = index < session.stageIndex || session.finished;
          return (
            <li
              key={stage.id}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "rounded-2xl border px-2 py-2 text-center text-xs font-semibold transition",
                isCurrent && "border-violet-400/60 bg-violet-500/20 text-white",
                isDone && "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
                !isCurrent && !isDone && "border-white/10 bg-white/5 text-slate-400",
              )}
            >
              <span className="flex items-center justify-center gap-1">
                {isDone ? <CheckCircle2 aria-hidden className="size-3.5" /> : null}
                {stage.label}
              </span>
              <span className="block font-normal">{stage.minutes} min</span>
            </li>
          );
        })}
      </ol>

      <Timer
        clock={formatClock(session.stageRemainingSeconds)}
        caption={
          session.finished
            ? "Sessão concluída!"
            : "Etapa atual: " + session.stage.label
        }
      />

      <ProgressBar
        className="mt-4"
        value={sessionPercentage}
        label={"Progresso da sessão: " + Math.round(sessionPercentage) + "%"}
      />

      <p className="mt-3 text-center text-sm font-semibold text-slate-300">
        {totalMinutes} min registrados hoje
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2">
        {running ? (
          <Button icon={Pause} variant="secondary" onClick={handlePause}>
            Pausar
          </Button>
        ) : (
          <Button icon={Play} onClick={handleStart} disabled={session.finished}>
            {elapsedSeconds > 0 && !session.finished ? "Retomar Sessão" : "Iniciar Sessão"}
          </Button>
        )}
        <Button
          icon={PlusCircle}
          variant="secondary"
          loading={isPending}
          onClick={() => recordMinutes(QUICK_MINUTES)}
        >
          Registrar +{QUICK_MINUTES} min
        </Button>
      </div>

      {elapsedSeconds > 0 && !running ? (
        <Button
          icon={RotateCcw}
          variant="ghost"
          size="md"
          className="mt-2"
          onClick={handleReset}
        >
          Reiniciar sessão
        </Button>
      ) : null}

      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-rose-300">
          {error}
        </p>
      ) : null}
    </GlassCard>
  );
}
