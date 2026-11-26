import { InvalidInputError, NotFoundError } from "@/domain/errors";
import type { DayReflection, StudyDay } from "@/domain/study-day";
import type { StudyDayRepository } from "@/repositories/study-day-repository";
import { countPendingTasks } from "@/services/checklist";
import { MAX_QUIZ_SCORE } from "@/services/quiz";

async function requireStudyDay(
  repository: StudyDayRepository,
  studyDayId: string,
): Promise<StudyDay> {
  const day = await repository.findById(studyDayId);
  if (!day) throw new NotFoundError("Dia de estudo");
  return day;
}

export async function saveStudyNotes(
  repository: StudyDayRepository,
  input: { studyDayId: string; notes: string },
): Promise<StudyDay> {
  const day = await requireStudyDay(repository, input.studyDayId);
  return repository.updateNotes(day.id, input.notes);
}

function isValidQuizScore(score: number | null): boolean {
  return score === null || (Number.isInteger(score) && score >= 0 && score <= MAX_QUIZ_SCORE);
}

function normalizeText(text: string | null): string | null {
  const trimmed = text?.trim() ?? "";
  return trimmed === "" ? null : trimmed;
}

export async function saveDayReflection(
  repository: StudyDayRepository,
  input: { studyDayId: string } & DayReflection,
): Promise<StudyDay> {
  if (!isValidQuizScore(input.quizScore)) {
    throw new InvalidInputError("A nota do quiz deve ser um número inteiro de 0 a 100");
  }
  const day = await requireStudyDay(repository, input.studyDayId);
  return repository.updateReflection(day.id, {
    quizScore: input.quizScore,
    difficulties: normalizeText(input.difficulties),
  });
}

export async function addStudyMinutes(
  repository: StudyDayRepository,
  input: { studyDayId: string; minutes: number },
): Promise<StudyDay> {
  if (!Number.isInteger(input.minutes) || input.minutes <= 0) {
    throw new InvalidInputError("Os minutos devem ser um inteiro positivo");
  }
  const day = await requireStudyDay(repository, input.studyDayId);
  return repository.addMinutesStudied(day.id, input.minutes);
}

export interface CompleteDayResult {
  studyDay: StudyDay;
  pendingTasks: number;
}

export async function completeStudyDay(
  repository: StudyDayRepository,
  input: { studyDayId: string },
  now: Date,
): Promise<CompleteDayResult> {
  const day = await requireStudyDay(repository, input.studyDayId);
  const studyDay = await repository.updateCompletion(day.id, {
    isCompleted: true,
    completedAt: now,
  });
  return { studyDay, pendingTasks: countPendingTasks(day.checklistTasks) };
}

export async function uncompleteStudyDay(
  repository: StudyDayRepository,
  input: { studyDayId: string },
): Promise<StudyDay> {
  const day = await requireStudyDay(repository, input.studyDayId);
  return repository.updateCompletion(day.id, {
    isCompleted: false,
    completedAt: null,
  });
}
