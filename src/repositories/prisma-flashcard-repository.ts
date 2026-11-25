import type { Prisma, PrismaClient } from "@prisma/client";
import type {
  Flashcard,
  FlashcardSchedule,
  NewFlashcard,
} from "@/domain/flashcard";
import type {
  DueFlashcardsQuery,
  FlashcardRepository,
} from "@/repositories/flashcard-repository";
import { toFlashcard } from "@/repositories/flashcard-mapper";

function releasedStudyDayFilter(
  query: DueFlashcardsQuery,
): Prisma.FlashcardWhereInput["studyDay"] {
  return {
    OR: [
      { isCompleted: true },
      { scheduledDate: { lte: query.releasedUntil } },
    ],
  };
}

function dueWhere(query: DueFlashcardsQuery): Prisma.FlashcardWhereInput {
  return {
    nextReviewAt: { lte: query.now },
    studyDay: releasedStudyDayFilter(query),
  };
}

export class PrismaFlashcardRepository implements FlashcardRepository {
  constructor(private readonly client: PrismaClient) {}

  count(): Promise<number> {
    return this.client.flashcard.count();
  }

  countDue(query: DueFlashcardsQuery): Promise<number> {
    return this.client.flashcard.count({ where: dueWhere(query) });
  }

  async findDue(query: DueFlashcardsQuery): Promise<Flashcard[]> {
    const rows = await this.client.flashcard.findMany({
      where: dueWhere(query),
      orderBy: [{ nextReviewAt: "asc" }, { id: "asc" }],
    });
    return rows.map(toFlashcard);
  }

  async findNextReviewAfter(query: DueFlashcardsQuery): Promise<Date | null> {
    const row = await this.client.flashcard.findFirst({
      where: {
        nextReviewAt: { gt: query.now },
        studyDay: releasedStudyDayFilter(query),
      },
      orderBy: { nextReviewAt: "asc" },
      select: { nextReviewAt: true },
    });
    return row?.nextReviewAt ?? null;
  }

  async findById(id: string): Promise<Flashcard | null> {
    const row = await this.client.flashcard.findUnique({ where: { id } });
    return row ? toFlashcard(row) : null;
  }

  async findByStudyDayId(studyDayId: string): Promise<Flashcard[]> {
    const rows = await this.client.flashcard.findMany({
      where: { studyDayId },
    });
    return rows.map(toFlashcard);
  }

  async create(data: NewFlashcard): Promise<Flashcard> {
    const row = await this.client.flashcard.create({ data });
    return toFlashcard(row);
  }

  async updateSchedule(
    id: string,
    schedule: FlashcardSchedule,
  ): Promise<Flashcard> {
    const row = await this.client.flashcard.update({
      where: { id },
      data: {
        intervalDays: schedule.intervalDays,
        easeFactor: schedule.easeFactor,
        repetitions: schedule.repetitions,
        nextReviewAt: schedule.nextReviewAt,
      },
    });
    return toFlashcard(row);
  }

  async createMissingForStudyDay(
    studyDayId: string,
    cards: NewFlashcard[],
  ): Promise<void> {
    const existing = await this.client.flashcard.findMany({
      where: { studyDayId },
      select: { question: true },
    });
    const known = new Set(existing.map((card) => card.question));
    const missing = cards.filter((card) => !known.has(card.question));
    if (missing.length === 0) return;
    await this.client.flashcard.createMany({ data: missing });
  }
}
