"use server";

import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { runAction } from "@/actions/run-action";
import { studyDayRepository } from "@/lib/repositories";
import { MAX_CUSTOM_TASK_LENGTH } from "@/services/checklist";
import { MAX_DIFFICULTIES_LENGTH, MAX_QUIZ_SCORE } from "@/services/quiz";
import {
  addCustomChecklistTask,
  removeCustomChecklistTask,
  toggleChecklistTask as toggleChecklistTaskUseCase,
} from "@/use-cases/manage-checklist";
import {
  addStudyMinutes as addStudyMinutesUseCase,
  completeStudyDay,
  saveDayReflection,
  saveStudyNotes,
  uncompleteStudyDay,
} from "@/use-cases/track-study-day";

const studyDayIdSchema = z.string().min(1);

const taskReferenceSchema = z.object({
  studyDayId: studyDayIdSchema,
  taskId: z.string().min(1),
});

const customTaskSchema = z.object({
  studyDayId: studyDayIdSchema,
  taskId: z.string().min(1).max(100),
  label: z.string().trim().min(1).max(MAX_CUSTOM_TASK_LENGTH),
});

const notesSchema = z.object({
  studyDayId: studyDayIdSchema,
  notes: z.string().max(20000),
});

const minutesSchema = z.object({
  studyDayId: studyDayIdSchema,
  minutes: z.number().int().min(1).max(240),
});

const dayReferenceSchema = z.object({ studyDayId: studyDayIdSchema });

const reflectionSchema = z.object({
  studyDayId: studyDayIdSchema,
  quizScore: z.number().int().min(0).max(MAX_QUIZ_SCORE).nullable(),
  difficulties: z.string().max(MAX_DIFFICULTIES_LENGTH).nullable(),
});

export async function saveReflection(input: unknown): Promise<ActionResult<null>> {
  return runAction({
    schema: reflectionSchema,
    input,
    handler: async (data) => {
      await saveDayReflection(studyDayRepository, data);
      return null;
    },
  });
}

export interface CompleteDayActionData {
  pendingTasks: number;
}

export async function toggleChecklistTask(
  input: unknown,
): Promise<ActionResult<null>> {
  return runAction({
    schema: taskReferenceSchema,
    input,
    handler: async (data) => {
      await toggleChecklistTaskUseCase(studyDayRepository, data);
      return null;
    },
  });
}

export async function addCustomTask(input: unknown): Promise<ActionResult<null>> {
  return runAction({
    schema: customTaskSchema,
    input,
    handler: async (data) => {
      await addCustomChecklistTask(studyDayRepository, data);
      return null;
    },
  });
}

export async function removeCustomTask(
  input: unknown,
): Promise<ActionResult<null>> {
  return runAction({
    schema: taskReferenceSchema,
    input,
    handler: async (data) => {
      await removeCustomChecklistTask(studyDayRepository, data);
      return null;
    },
  });
}

export async function saveNotes(input: unknown): Promise<ActionResult<null>> {
  return runAction({
    schema: notesSchema,
    input,
    shouldRevalidate: false,
    handler: async (data) => {
      await saveStudyNotes(studyDayRepository, data);
      return null;
    },
  });
}

export async function addStudyMinutes(
  input: unknown,
): Promise<ActionResult<{ minutesStudied: number }>> {
  return runAction({
    schema: minutesSchema,
    input,
    shouldRevalidate: false,
    handler: async (data) => {
      const updated = await addStudyMinutesUseCase(studyDayRepository, data);
      return { minutesStudied: updated.minutesStudied };
    },
  });
}

export async function completeDay(
  input: unknown,
): Promise<ActionResult<CompleteDayActionData>> {
  return runAction({
    schema: dayReferenceSchema,
    input,
    handler: async (data) => {
      const result = await completeStudyDay(studyDayRepository, data, new Date());
      return { pendingTasks: result.pendingTasks };
    },
  });
}

export async function uncompleteDay(
  input: unknown,
): Promise<ActionResult<null>> {
  return runAction({
    schema: dayReferenceSchema,
    input,
    handler: async (data) => {
      await uncompleteStudyDay(studyDayRepository, data);
      return null;
    },
  });
}
