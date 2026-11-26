import type {
  Flashcard,
  FlashcardSchedule,
  NewFlashcard,
} from "@/domain/flashcard";
import type {
  DueFlashcardsQuery,
  FlashcardRepository,
} from "@/repositories/flashcard-repository";

type ReleasePolicy = (card: Flashcard) => boolean;

const ALWAYS_RELEASED: ReleasePolicy = () => true;

export class InMemoryFlashcardRepository implements FlashcardRepository {
  private cards: Flashcard[];
  private sequence = 0;

  constructor(
    initialCards: Flashcard[] = [],
    private readonly isReleased: ReleasePolicy = ALWAYS_RELEASED,
  ) {
    this.cards = initialCards.map((card) => ({ ...card }));
  }

  async count(): Promise<number> {
    return this.cards.length;
  }

  async findAll(): Promise<Flashcard[]> {
    return this.cards.map((card) => ({ ...card }));
  }

  async countDue(query: DueFlashcardsQuery): Promise<number> {
    return (await this.findDue(query)).length;
  }

  async findDue(query: DueFlashcardsQuery): Promise<Flashcard[]> {
    return this.cards
      .filter((card) => this.isReleased(card) && card.nextReviewAt <= query.now)
      .sort((first, second) => first.nextReviewAt.getTime() - second.nextReviewAt.getTime())
      .map((card) => ({ ...card }));
  }

  async findNextReviewAfter(query: DueFlashcardsQuery): Promise<Date | null> {
    const upcoming = this.cards
      .filter((card) => this.isReleased(card) && card.nextReviewAt > query.now)
      .sort((first, second) => first.nextReviewAt.getTime() - second.nextReviewAt.getTime());
    return upcoming[0]?.nextReviewAt ?? null;
  }

  async findById(id: string): Promise<Flashcard | null> {
    const card = this.cards.find((item) => item.id === id);
    return card ? { ...card } : null;
  }

  async findByStudyDayId(studyDayId: string): Promise<Flashcard[]> {
    return this.cards.filter((card) => card.studyDayId === studyDayId).map((card) => ({ ...card }));
  }

  async create(data: NewFlashcard): Promise<Flashcard> {
    this.sequence += 1;
    const created: Flashcard = {
      ...data,
      id: "novo-" + this.sequence,
      intervalDays: 1,
      easeFactor: 2.5,
      repetitions: 0,
    };
    this.cards.push(created);
    return { ...created };
  }

  async createMany(cards: NewFlashcard[]): Promise<number> {
    for (const card of cards) await this.create(card);
    return cards.length;
  }

  async updateSchedule(
    id: string,
    schedule: FlashcardSchedule,
  ): Promise<Flashcard> {
    const card = this.cards.find((item) => item.id === id);
    if (!card) throw new Error("Flashcard não encontrado: " + id);
    Object.assign(card, schedule);
    return { ...card };
  }

  async createMissingForStudyDay(
    studyDayId: string,
    cards: NewFlashcard[],
  ): Promise<void> {
    for (const data of cards) {
      const exists = this.cards.some(
        (card) => card.studyDayId === studyDayId && card.question === data.question,
      );
      if (!exists) await this.create(data);
    }
  }
}

export function buildFlashcard(overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    id: "card-1",
    studyDayId: "dia-1",
    moduleTitle: "Módulo de teste",
    question: "Pergunta?",
    answer: "Resposta.",
    codeExample: null,
    nextReviewAt: new Date("2026-11-24T00:00:00.000Z"),
    intervalDays: 1,
    easeFactor: 2.5,
    repetitions: 0,
    ...overrides,
  };
}
