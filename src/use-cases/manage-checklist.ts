import { NotFoundError } from "@/domain/errors";
import type { StudyDay } from "@/domain/study-day";
import type { StudyDayRepository } from "@/repositories/study-day-repository";
import {
  addCustomTask,
  removeCustomTask,
  toggleTask,
} from "@/services/checklist";

async function requireStudyDay(
  repository: StudyDayRepository,
  studyDayId: string,
): Promise<StudyDay> {
  const day = await repository.findById(studyDayId);
  if (!day) throw new NotFoundError("Dia de estudo");
  return day;
}

export async function toggleChecklistTask(
  repository: StudyDayRepository,
  input: { studyDayId: string; taskId: string },
): Promise<StudyDay> {
  const day = await requireStudyDay(repository, input.studyDayId);
  return repository.updateChecklist(day.id, toggleTask(day.checklistTasks, input.taskId));
}

export async function addCustomChecklistTask(
  repository: StudyDayRepository,
  input: { studyDayId: string; taskId: string; label: string },
): Promise<StudyDay> {
  const day = await requireStudyDay(repository, input.studyDayId);
  const tasks = addCustomTask(day.checklistTasks, input.label, input.taskId);
  return repository.updateChecklist(day.id, tasks);
}

export async function removeCustomChecklistTask(
  repository: StudyDayRepository,
  input: { studyDayId: string; taskId: string },
): Promise<StudyDay> {
  const day = await requireStudyDay(repository, input.studyDayId);
  return repository.updateChecklist(day.id, removeCustomTask(day.checklistTasks, input.taskId));
}
