import { describe, expect, it } from "vitest";
import type { ChecklistTask } from "@/domain/study-day";
import {
  addCustomTask,
  countPendingTasks,
  removeCustomTask,
  toggleTask,
} from "@/services/checklist";

const BASE_TASKS: ChecklistTask[] = [
  { id: "t1", label: "Ler a aula", done: false, isCustom: false },
  { id: "t2", label: "Fazer o desafio", done: true, isCustom: false },
];

describe("checklist", () => {
  it("alterna apenas a tarefa informada sem mutar a lista", () => {
    const result = toggleTask(BASE_TASKS, "t1");

    expect(result[0].done).toBe(true);
    expect(result[1].done).toBe(true);
    expect(BASE_TASKS[0].done).toBe(false);
  });

  it("adiciona tarefa personalizada com o texto limpo", () => {
    const result = addCustomTask(BASE_TASKS, "  Revisar anotações  ", "c1");

    expect(result).toHaveLength(3);
    expect(result[2]).toEqual({
      id: "c1",
      label: "Revisar anotações",
      done: false,
      isCustom: true,
    });
  });

  it("ignora tarefa personalizada vazia", () => {
    expect(addCustomTask(BASE_TASKS, "   ", "c1")).toBe(BASE_TASKS);
  });

  it("remove somente tarefas personalizadas", () => {
    const withCustom = addCustomTask(BASE_TASKS, "Extra", "c1");

    expect(removeCustomTask(withCustom, "c1")).toHaveLength(2);
    expect(removeCustomTask(withCustom, "t1")).toHaveLength(3);
  });

  it("conta as tarefas pendentes", () => {
    expect(countPendingTasks(BASE_TASKS)).toBe(1);
    expect(countPendingTasks([])).toBe(0);
  });
});
