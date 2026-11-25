import type { ChecklistTask } from "@/domain/study-day";

export const MAX_CUSTOM_TASK_LENGTH = 120;

export function toggleTask(
  tasks: ChecklistTask[],
  taskId: string,
): ChecklistTask[] {
  return tasks.map((task) =>
    task.id === taskId ? { ...task, done: !task.done } : task,
  );
}

export function addCustomTask(
  tasks: ChecklistTask[],
  label: string,
  id: string,
): ChecklistTask[] {
  const cleanLabel = label.trim().slice(0, MAX_CUSTOM_TASK_LENGTH);
  if (cleanLabel === "") return tasks;
  if (tasks.some((task) => task.id === id)) return tasks;
  return [...tasks, { id, label: cleanLabel, done: false, isCustom: true }];
}

export function removeCustomTask(
  tasks: ChecklistTask[],
  taskId: string,
): ChecklistTask[] {
  return tasks.filter((task) => !(task.id === taskId && task.isCustom));
}

export function countPendingTasks(tasks: ChecklistTask[]): number {
  return tasks.filter((task) => !task.done).length;
}
