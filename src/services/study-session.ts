import type { StudyDayKind } from "@/domain/study-day-kind";

export interface SessionStage {
  id: string;
  label: string;
  minutes: number;
}

export type SessionPlan = readonly SessionStage[];

export const SESSION_TOTAL_MINUTES = 60;

export const SESSION_TOTAL_SECONDS = SESSION_TOTAL_MINUTES * 60;

const SESSION_PLANS: Record<StudyDayKind, SessionPlan> = {
  AULA: [
    { id: "flashcards", label: "Flashcards", minutes: 10 },
    { id: "teoria", label: "Teoria", minutes: 30 },
    { id: "desafio", label: "Desafio", minutes: 20 },
  ],
  AVALIACAO: [
    { id: "flashcards", label: "Flashcards", minutes: 10 },
    { id: "avaliacao", label: "Avaliação", minutes: 40 },
    { id: "erros", label: "Revisar erros", minutes: 10 },
  ],
  REVISAO: [
    { id: "flashcards", label: "Flashcards", minutes: 25 },
    { id: "revisao", label: "Revisão", minutes: 20 },
    { id: "desafio", label: "Desafio", minutes: 15 },
  ],
  PROJETO: [
    { id: "planejar", label: "Planejar", minutes: 10 },
    { id: "construir", label: "Construir", minutes: 40 },
    { id: "revisar", label: "Revisar", minutes: 10 },
  ],
  TRILHA: [
    { id: "flashcards", label: "Flashcards", minutes: 10 },
    { id: "estudo", label: "Estudo", minutes: 30 },
    { id: "pratica", label: "Prática", minutes: 20 },
  ],
};

export function getSessionPlan(kind: StudyDayKind): SessionPlan {
  return SESSION_PLANS[kind];
}

export interface SessionState {
  stageIndex: number;
  stage: SessionStage;
  stageRemainingSeconds: number;
  totalRemainingSeconds: number;
  finished: boolean;
}

export function getSessionState(
  plan: SessionPlan,
  elapsedSeconds: number,
): SessionState {
  const elapsed = Math.min(Math.max(0, Math.floor(elapsedSeconds)), SESSION_TOTAL_SECONDS);
  const finished = elapsed >= SESSION_TOTAL_SECONDS;

  let stageStart = 0;
  for (let index = 0; index < plan.length; index++) {
    const stage = plan[index];
    const stageEnd = stageStart + stage.minutes * 60;
    if (elapsed < stageEnd) {
      return {
        stageIndex: index,
        stage,
        stageRemainingSeconds: stageEnd - elapsed,
        totalRemainingSeconds: SESSION_TOTAL_SECONDS - elapsed,
        finished,
      };
    }
    stageStart = stageEnd;
  }

  const lastIndex = plan.length - 1;
  return {
    stageIndex: lastIndex,
    stage: plan[lastIndex],
    stageRemainingSeconds: 0,
    totalRemainingSeconds: 0,
    finished,
  };
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

export function wholeMinutesToRecord(
  elapsedSeconds: number,
  recordedSeconds: number,
): number {
  return Math.floor(Math.max(0, elapsedSeconds - recordedSeconds) / 60);
}
