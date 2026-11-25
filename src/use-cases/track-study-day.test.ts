import { describe, expect, it } from "vitest";
import { InvalidInputError } from "@/domain/errors";
import {
  InMemoryStudyDayRepository,
  buildStudyDay,
} from "@/repositories/in-memory-study-day-repository";
import {
  addStudyMinutes,
  completeStudyDay,
  saveStudyNotes,
  uncompleteStudyDay,
} from "@/use-cases/track-study-day";

const NOW = new Date("2026-12-10T15:00:00.000Z");

function createRepository(): InMemoryStudyDayRepository {
  return new InMemoryStudyDayRepository([
    buildStudyDay({
      dayNumber: 1,
      checklistTasks: [
        { id: "t1", label: "A", done: true, isCustom: false },
        { id: "t2", label: "B", done: false, isCustom: false },
      ],
    }),
  ]);
}

describe("track-study-day", () => {
  it("salva as notas do dia", async () => {
    const updated = await saveStudyNotes(createRepository(), {
      studyDayId: "dia-1",
      notes: "Entendi closures",
    });

    expect(updated.notes).toBe("Entendi closures");
  });

  it("soma minutos estudados", async () => {
    const repository = createRepository();
    await addStudyMinutes(repository, { studyDayId: "dia-1", minutes: 15 });
    const updated = await addStudyMinutes(repository, {
      studyDayId: "dia-1",
      minutes: 10,
    });

    expect(updated.minutesStudied).toBe(25);
  });

  it("rejeita minutos inválidos", async () => {
    await expect(
      addStudyMinutes(createRepository(), { studyDayId: "dia-1", minutes: 0 }),
    ).rejects.toBeInstanceOf(InvalidInputError);
  });

  it("conclui o dia mesmo com tarefas pendentes e informa quantas faltam", async () => {
    const result = await completeStudyDay(createRepository(), { studyDayId: "dia-1" }, NOW);

    expect(result.studyDay.isCompleted).toBe(true);
    expect(result.studyDay.completedAt).toEqual(NOW);
    expect(result.pendingTasks).toBe(1);
  });

  it("desfaz a conclusão do dia", async () => {
    const repository = createRepository();
    await completeStudyDay(repository, { studyDayId: "dia-1" }, NOW);

    const reverted = await uncompleteStudyDay(repository, { studyDayId: "dia-1" });

    expect(reverted.isCompleted).toBe(false);
    expect(reverted.completedAt).toBeNull();
  });
});
