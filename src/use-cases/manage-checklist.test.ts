import { describe, expect, it } from "vitest";
import { NotFoundError } from "@/domain/errors";
import {
  InMemoryStudyDayRepository,
  buildStudyDay,
} from "@/repositories/in-memory-study-day-repository";
import {
  addCustomChecklistTask,
  removeCustomChecklistTask,
  toggleChecklistTask,
} from "@/use-cases/manage-checklist";

function createRepository(): InMemoryStudyDayRepository {
  return new InMemoryStudyDayRepository([
    buildStudyDay({
      dayNumber: 1,
      checklistTasks: [
        { id: "t1", label: "Ler a aula", done: false, isCustom: false },
      ],
    }),
  ]);
}

describe("manage-checklist", () => {
  it("alterna uma tarefa existente", async () => {
    const repository = createRepository();

    const updated = await toggleChecklistTask(repository, {
      studyDayId: "dia-1",
      taskId: "t1",
    });

    expect(updated.checklistTasks[0].done).toBe(true);
  });

  it("adiciona e remove uma tarefa personalizada", async () => {
    const repository = createRepository();

    const added = await addCustomChecklistTask(repository, {
      studyDayId: "dia-1",
      taskId: "custom-1",
      label: "  Extra  ",
    });
    expect(added.checklistTasks).toHaveLength(2);
    expect(added.checklistTasks[1].label).toBe("Extra");

    const removed = await removeCustomChecklistTask(repository, {
      studyDayId: "dia-1",
      taskId: "custom-1",
    });
    expect(removed.checklistTasks).toHaveLength(1);
  });

  it("ignora tarefa personalizada repetida com o mesmo id", async () => {
    const repository = createRepository();
    const input = { studyDayId: "dia-1", taskId: "custom-1", label: "Extra" };

    await addCustomChecklistTask(repository, input);
    const again = await addCustomChecklistTask(repository, input);

    expect(again.checklistTasks).toHaveLength(2);
  });

  it("não remove tarefas que vieram do curso", async () => {
    const repository = createRepository();

    const result = await removeCustomChecklistTask(repository, {
      studyDayId: "dia-1",
      taskId: "t1",
    });

    expect(result.checklistTasks).toHaveLength(1);
  });

  it("lança NotFoundError para dia inexistente", async () => {
    const repository = createRepository();

    await expect(
      toggleChecklistTask(repository, { studyDayId: "nao-existe", taskId: "t1" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
