import type {
  ChecklistTask,
  NewStudyDay,
  ScheduledDateUpdate,
  StudyDay,
  StudyDayWithRelations,
} from "@/domain/study-day";
import type {
  CompletionUpdate,
  StudyDayRepository,
} from "@/repositories/study-day-repository";

export class InMemoryStudyDayRepository implements StudyDayRepository {
  private days: StudyDay[];

  constructor(initialDays: StudyDay[] = []) {
    this.days = initialDays.map((day) => ({ ...day }));
  }

  async count(): Promise<number> {
    return this.days.length;
  }

  async findById(id: string): Promise<StudyDay | null> {
    return this.days.find((day) => day.id === id) ?? null;
  }

  async findByDayNumber(
    dayNumber: number,
  ): Promise<StudyDayWithRelations | null> {
    const day = this.days.find((item) => item.dayNumber === dayNumber);
    return day ? { ...day, flashcards: [], challenges: [] } : null;
  }

  async findAll(): Promise<StudyDay[]> {
    return [...this.days].sort((first, second) => first.dayNumber - second.dayNumber);
  }

  async upsertByDayNumber(data: NewStudyDay): Promise<StudyDay> {
    const existing = this.days.find((day) => day.dayNumber === data.dayNumber);
    if (existing) {
      Object.assign(existing, { ...data, checklistTasks: existing.checklistTasks });
      return existing;
    }
    const created: StudyDay = {
      ...data,
      id: "dia-" + data.dayNumber,
      minutesStudied: 0,
      notes: null,
    };
    this.days.push(created);
    return created;
  }

  async updateChecklist(id: string, tasks: ChecklistTask[]): Promise<StudyDay> {
    return this.update(id, { checklistTasks: tasks });
  }

  async updateNotes(id: string, notes: string): Promise<StudyDay> {
    return this.update(id, { notes });
  }

  async addMinutesStudied(id: string, minutes: number): Promise<StudyDay> {
    const current = this.require(id);
    return this.update(id, { minutesStudied: current.minutesStudied + minutes });
  }

  async updateCompletion(
    id: string,
    completion: CompletionUpdate,
  ): Promise<StudyDay> {
    return this.update(id, {
      isCompleted: completion.isCompleted,
      completedAt: completion.completedAt,
    });
  }

  async updateScheduledDates(updates: ScheduledDateUpdate[]): Promise<void> {
    for (const update of updates) {
      this.update(update.id, { scheduledDate: update.scheduledDate });
    }
  }

  private require(id: string): StudyDay {
    const day = this.days.find((item) => item.id === id);
    if (!day) throw new Error("Dia não encontrado: " + id);
    return day;
  }

  private update(id: string, changes: Partial<StudyDay>): StudyDay {
    const day = this.require(id);
    Object.assign(day, changes);
    return { ...day };
  }
}

export function buildStudyDay(overrides: Partial<StudyDay> = {}): StudyDay {
  const dayNumber = overrides.dayNumber ?? 1;
  return {
    id: "dia-" + dayNumber,
    dayNumber,
    scheduledDate: new Date("2026-11-24T00:00:00.000Z"),
    sectionTitle: "Seção de teste",
    kind: "AULA",
    courseLesson: dayNumber,
    moduleTitle: "Módulo de teste",
    topicTitle: "Tópico " + dayNumber,
    summaryContent: "",
    keyTakeaways: [],
    checklistTasks: [],
    isCompleted: false,
    completedAt: null,
    minutesStudied: 0,
    notes: null,
    ...overrides,
  };
}
