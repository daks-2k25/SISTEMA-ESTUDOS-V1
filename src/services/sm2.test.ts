import { describe, expect, it } from "vitest";
import type { Flashcard, FlashcardRating } from "@/domain/flashcard";
import {
  MIN_EASE_FACTOR,
  calculateNextReview,
  formatCodeExample,
  formatReviewInterval,
  previewIntervals,
} from "@/services/sm2";

const NOW = new Date("2026-12-01T12:00:00.000Z");

type ReviewState = Pick<Flashcard, "intervalDays" | "easeFactor" | "repetitions">;

const NEW_CARD: ReviewState = { intervalDays: 1, easeFactor: 2.5, repetitions: 0 };

function daysBetween(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000);
}

function advance(card: ReviewState, rating: FlashcardRating): ReviewState {
  const next = calculateNextReview(card, rating, NOW);
  return {
    intervalDays: next.intervalDays,
    easeFactor: next.easeFactor,
    repetitions: next.repetitions,
  };
}

describe("calculateNextReview: Errei", () => {
  it("zera as repetições, volta o intervalo para 1 dia e reduz o fator de facilidade", () => {
    const card = { intervalDays: 15, easeFactor: 2.5, repetitions: 4 };
    const result = calculateNextReview(card, 1, NOW);

    expect(result.repetitions).toBe(0);
    expect(result.intervalDays).toBe(1);
    expect(result.easeFactor).toBe(2.3);
  });

  it("agenda a nova tentativa para 10 minutos depois", () => {
    const result = calculateNextReview(NEW_CARD, 1, NOW);

    expect(result.nextReviewAt.getTime() - NOW.getTime()).toBe(10 * 60 * 1000);
  });

  it("nunca deixa o fator de facilidade abaixo de 1.3", () => {
    const low = { intervalDays: 5, easeFactor: 1.35, repetitions: 3 };

    expect(calculateNextReview(low, 1, NOW).easeFactor).toBe(MIN_EASE_FACTOR);
    expect(advance({ ...low, easeFactor: MIN_EASE_FACTOR }, 1).easeFactor).toBe(
      MIN_EASE_FACTOR,
    );
  });
});

describe("calculateNextReview: Difícil", () => {
  it("cresce o intervalo por 1.2 e reduz o fator em 0.15", () => {
    const card = { intervalDays: 10, easeFactor: 2.5, repetitions: 3 };
    const result = calculateNextReview(card, 2, NOW);

    expect(result.intervalDays).toBe(12);
    expect(result.easeFactor).toBe(2.35);
    expect(result.repetitions).toBe(3);
    expect(daysBetween(NOW, result.nextReviewAt)).toBe(12);
  });

  it("respeita o piso do fator de facilidade", () => {
    const low = { intervalDays: 3, easeFactor: 1.4, repetitions: 2 };

    expect(calculateNextReview(low, 2, NOW).easeFactor).toBe(MIN_EASE_FACTOR);
  });

  it("mantém no mínimo 1 dia de intervalo", () => {
    expect(calculateNextReview(NEW_CARD, 2, NOW).intervalDays).toBe(1);
  });
});

describe("calculateNextReview: Bom", () => {
  it("primeira vez agenda 1 dia", () => {
    const result = calculateNextReview(NEW_CARD, 3, NOW);

    expect(result.intervalDays).toBe(1);
    expect(result.repetitions).toBe(1);
    expect(result.easeFactor).toBe(2.5);
  });

  it("segunda vez agenda 6 dias", () => {
    const secondTime = { intervalDays: 1, easeFactor: 2.5, repetitions: 1 };

    expect(calculateNextReview(secondTime, 3, NOW).intervalDays).toBe(6);
  });

  it("depois multiplica o intervalo pelo fator de facilidade", () => {
    const later = { intervalDays: 6, easeFactor: 2.5, repetitions: 2 };

    expect(calculateNextReview(later, 3, NOW).intervalDays).toBe(15);
  });

  it("segue a sequência 1, 6, 15, 38 com notas Bom consecutivas", () => {
    const intervals: number[] = [];
    let card: ReviewState = NEW_CARD;

    for (let step = 0; step < 4; step++) {
      card = advance(card, 3);
      intervals.push(card.intervalDays);
    }

    expect(intervals).toEqual([1, 6, 15, 38]);
  });
});

describe("calculateNextReview: Fácil", () => {
  it("aplica bônus de 1.3 sobre o intervalo de Bom e aumenta o fator", () => {
    const first = calculateNextReview(NEW_CARD, 4, NOW);
    const later = calculateNextReview(
      { intervalDays: 6, easeFactor: 2.5, repetitions: 2 },
      4,
      NOW,
    );

    expect(first.intervalDays).toBe(2);
    expect(first.easeFactor).toBe(2.65);
    expect(first.repetitions).toBe(1);
    expect(later.intervalDays).toBe(20);
  });

  it("é sempre maior ou igual ao intervalo de Bom", () => {
    const card = { intervalDays: 6, easeFactor: 2.5, repetitions: 2 };

    expect(calculateNextReview(card, 4, NOW).intervalDays).toBeGreaterThanOrEqual(
      calculateNextReview(card, 3, NOW).intervalDays,
    );
  });
});

describe("previewIntervals", () => {
  it("mostra o intervalo previsto para cada nota de um card novo", () => {
    expect(previewIntervals(NEW_CARD, NOW)).toEqual({
      1: "10 min",
      2: "1 dia",
      3: "1 dia",
      4: "2 dias",
    });
  });

  it("mostra dias para a segunda revisão e meses para intervalos longos", () => {
    const second = { intervalDays: 1, easeFactor: 2.5, repetitions: 1 };
    const veteran = { intervalDays: 60, easeFactor: 2.5, repetitions: 6 };

    expect(previewIntervals(second, NOW)[3]).toBe("6 dias");
    expect(previewIntervals(veteran, NOW)[3]).toBe("5 meses");
  });
});

describe("formatReviewInterval", () => {
  it("escolhe a unidade mais adequada", () => {
    const at = (minutes: number) => new Date(NOW.getTime() + minutes * 60 * 1000);

    expect(formatReviewInterval(NOW, at(10))).toBe("10 min");
    expect(formatReviewInterval(NOW, at(120))).toBe("2 horas");
    expect(formatReviewInterval(NOW, at(24 * 60))).toBe("1 dia");
    expect(formatReviewInterval(NOW, at(6 * 24 * 60))).toBe("6 dias");
    expect(formatReviewInterval(NOW, at(30 * 24 * 60))).toBe("1 mês");
  });
});

describe("formatCodeExample", () => {
  it("envolve código puro em um bloco javascript", () => {
    expect(formatCodeExample("const a = 1;")).toBe(
      "```javascript\nconst a = 1;\n```",
    );
  });

  it("mantém blocos que já vêm com cercas e ignora texto vazio", () => {
    const fenced = "```ts\nlet x = 1;\n```";

    expect(formatCodeExample(fenced)).toBe(fenced);
    expect(formatCodeExample("   ")).toBeNull();
  });
});
