import type { Prisma, PrismaClient, StudyDay as StudyDayRow } from "@prisma/client";
import type {
  ChecklistTask,
  DayReflection,
  NewStudyDay,
  ScheduledDateUpdate,
  StudyDay,
  StudyDaySummary,
  StudyDayWithRelations,
} from "@/domain/study-day";
import { parseStudyDayKind } from "@/domain/study-day-kind";
import type {
  CompletionUpdate,
  StudyDayRepository,
} from "@/repositories/study-day-repository";
import {
  parseChecklist,
  parseStringList,
  serializeChecklist,
  serializeStringList,
} from "@/lib/json-mappers";
import { toFlashcard } from "@/repositories/flashcard-mapper";
import { toDailyChallenge } from "@/repositories/daily-challenge-mapper";

const SUMMARY_COLUMNS = {
  id: true,
  dayNumber: true,
  scheduledDate: true,
  kind: true,
  courseLesson: true,
  moduleTitle: true,
  topicTitle: true,
  isCompleted: true,
  completedAt: true,
  quizScore: true,
} satisfies Prisma.StudyDaySelect;

function toStudyDay(row: StudyDayRow): StudyDay {
  return {
    id: row.id,
    dayNumber: row.dayNumber,
    scheduledDate: row.scheduledDate,
    sectionTitle: row.sectionTitle,
    kind: parseStudyDayKind(row.kind),
    courseLesson: row.courseLesson,
    moduleTitle: row.moduleTitle,
    topicTitle: row.topicTitle,
    summaryContent: row.summaryContent,
    keyTakeaways: parseStringList(row.keyTakeaways),
    checklistTasks: parseChecklist(row.checklistTasks),
    isCompleted: row.isCompleted,
    completedAt: row.completedAt,
    minutesStudied: row.minutesStudied,
    notes: row.notes,
    quizScore: row.quizScore,
    difficulties: row.difficulties,
  };
}

function toContentPersistence(data: NewStudyDay) {
  return {
    sectionTitle: data.sectionTitle,
    kind: data.kind,
    courseLesson: data.courseLesson,
    moduleTitle: data.moduleTitle,
    topicTitle: data.topicTitle,
    summaryContent: data.summaryContent,
    keyTakeaways: serializeStringList(data.keyTakeaways),
  };
}

function toCreatePersistence(data: NewStudyDay) {
  return {
    ...toContentPersistence(data),
    dayNumber: data.dayNumber,
    scheduledDate: data.scheduledDate,
    checklistTasks: serializeChecklist(data.checklistTasks),
    isCompleted: data.isCompleted,
    completedAt: data.completedAt,
  };
}

export class PrismaStudyDayRepository implements StudyDayRepository {
  constructor(private readonly client: PrismaClient) {}

  count(): Promise<number> {
    return this.client.studyDay.count();
  }

  async findByDayNumber(
    dayNumber: number,
  ): Promise<StudyDayWithRelations | null> {
    const byDay = { studyDay: { dayNumber } };
    const [row, flashcards, challenges] = await Promise.all([
      this.client.studyDay.findUnique({ where: { dayNumber } }),
      this.client.flashcard.findMany({ where: byDay }),
      this.client.dailyChallenge.findMany({ where: byDay }),
    ]);
    if (!row) return null;
    return {
      ...toStudyDay(row),
      flashcards: flashcards.map(toFlashcard),
      challenges: challenges.map(toDailyChallenge),
    };
  }

  async findAll(): Promise<StudyDay[]> {
    const rows = await this.client.studyDay.findMany({
      orderBy: { dayNumber: "asc" },
    });
    return rows.map(toStudyDay);
  }

  async findSummaries(): Promise<StudyDaySummary[]> {
    const rows = await this.client.studyDay.findMany({
      orderBy: { dayNumber: "asc" },
      select: SUMMARY_COLUMNS,
    });
    return rows.map((row) => ({ ...row, kind: parseStudyDayKind(row.kind) }));
  }

  async upsertByDayNumber(data: NewStudyDay): Promise<StudyDay> {
    const row = await this.client.studyDay.upsert({
      where: { dayNumber: data.dayNumber },
      create: toCreatePersistence(data),
      update: toContentPersistence(data),
    });
    return toStudyDay(row);
  }

  async findById(id: string): Promise<StudyDay | null> {
    const row = await this.client.studyDay.findUnique({ where: { id } });
    return row ? toStudyDay(row) : null;
  }

  async updateNotes(id: string, notes: string): Promise<StudyDay> {
    const row = await this.client.studyDay.update({
      where: { id },
      data: { notes },
    });
    return toStudyDay(row);
  }

  async updateReflection(id: string, reflection: DayReflection): Promise<StudyDay> {
    const row = await this.client.studyDay.update({
      where: { id },
      data: { quizScore: reflection.quizScore, difficulties: reflection.difficulties },
    });
    return toStudyDay(row);
  }

  async addMinutesStudied(id: string, minutes: number): Promise<StudyDay> {
    const row = await this.client.studyDay.update({
      where: { id },
      data: { minutesStudied: { increment: minutes } },
    });
    return toStudyDay(row);
  }

  async updateCompletion(
    id: string,
    update: CompletionUpdate,
  ): Promise<StudyDay> {
    const row = await this.client.studyDay.update({
      where: { id },
      data: {
        isCompleted: update.isCompleted,
        completedAt: update.completedAt,
      },
    });
    return toStudyDay(row);
  }

  async updateScheduledDates(updates: ScheduledDateUpdate[]): Promise<void> {
    if (updates.length === 0) return;
    const ids = updates.map((update) => update.id);
    const dates = updates.map((update) => update.scheduledDate.toISOString());

    await this.client.$executeRaw`
      UPDATE "StudyDay" AS day
      SET "scheduledDate" = updated.scheduled_date::timestamp(3)
      FROM unnest(${ids}::text[], ${dates}::text[]) AS updated(id, scheduled_date)
      WHERE day.id = updated.id
    `;
  }

  async updateChecklist(id: string, tasks: ChecklistTask[]): Promise<StudyDay> {
    const row = await this.client.studyDay.update({
      where: { id },
      data: { checklistTasks: serializeChecklist(tasks) },
    });
    return toStudyDay(row);
  }
}
