import { z } from "zod";
import type { ChecklistTask } from "@/domain/study-day";

const stringListSchema = z.array(z.string());

const checklistSchema = z.array(
  z.object({
    id: z.string(),
    label: z.string(),
    done: z.boolean(),
    isCustom: z.boolean().default(false),
  }),
);

export function parseStringList(raw: string): string[] {
  return stringListSchema.parse(JSON.parse(raw));
}

export function serializeStringList(list: string[]): string {
  return JSON.stringify(list);
}

export function parseChecklist(raw: string): ChecklistTask[] {
  return checklistSchema.parse(JSON.parse(raw));
}

export function serializeChecklist(tasks: ChecklistTask[]): string {
  return JSON.stringify(tasks);
}
