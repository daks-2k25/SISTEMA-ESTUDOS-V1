import type {
  DailyChallenge,
  NewDailyChallenge,
} from "@/domain/daily-challenge";
import type { DailyChallengeRepository } from "@/repositories/daily-challenge-repository";

export class InMemoryDailyChallengeRepository
  implements DailyChallengeRepository
{
  private challenges: DailyChallenge[];

  constructor(initialChallenges: DailyChallenge[] = []) {
    this.challenges = initialChallenges.map((challenge) => ({ ...challenge }));
  }

  async count(): Promise<number> {
    return this.challenges.length;
  }

  async findAll(): Promise<DailyChallenge[]> {
    return this.challenges.map((challenge) => ({ ...challenge }));
  }

  async findById(id: string): Promise<DailyChallenge | null> {
    const challenge = this.challenges.find((item) => item.id === id);
    return challenge ? { ...challenge } : null;
  }

  async findByStudyDayId(studyDayId: string): Promise<DailyChallenge[]> {
    return this.challenges
      .filter((challenge) => challenge.studyDayId === studyDayId)
      .map((challenge) => ({ ...challenge }));
  }

  async findByStudyDayIds(studyDayIds: string[]): Promise<DailyChallenge[]> {
    return this.challenges
      .filter((challenge) => studyDayIds.includes(challenge.studyDayId))
      .map((challenge) => ({ ...challenge }));
  }

  async saveDraft(id: string, userCode: string): Promise<DailyChallenge> {
    return this.update(id, { userCode });
  }

  async markCompleted(id: string, userCode: string): Promise<DailyChallenge> {
    return this.update(id, { userCode, isCompleted: true });
  }

  async syncForStudyDay(
    studyDayId: string,
    challenges: NewDailyChallenge[],
  ): Promise<void> {
    const plannedTitles = challenges.map((challenge) => challenge.title);
    this.challenges = this.challenges.filter(
      (item) => item.studyDayId !== studyDayId || plannedTitles.includes(item.title),
    );

    for (const data of challenges) {
      const existing = this.challenges.find(
        (item) => item.studyDayId === studyDayId && item.title === data.title,
      );
      if (existing) {
        Object.assign(existing, data);
      } else {
        this.challenges.push({ ...data, id: "desafio-" + (this.challenges.length + 1), isCompleted: false, userCode: null });
      }
    }
  }

  private update(id: string, changes: Partial<DailyChallenge>): DailyChallenge {
    const challenge = this.challenges.find((item) => item.id === id);
    if (!challenge) throw new Error("Desafio não encontrado: " + id);
    Object.assign(challenge, changes);
    return { ...challenge };
  }
}

export function buildChallenge(
  overrides: Partial<DailyChallenge> = {},
): DailyChallenge {
  return {
    id: "desafio-1",
    studyDayId: "dia-1",
    title: "Desafio de teste",
    description: "Descrição do desafio.",
    starterCode: "function f() {}",
    hint: "Dica.",
    solutionCode: "function f() { return 1; }",
    isCompleted: false,
    userCode: null,
    ...overrides,
  };
}
