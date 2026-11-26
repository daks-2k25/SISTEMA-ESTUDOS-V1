import type { PrismaClient } from "@prisma/client";
import type {
  DailyChallenge,
  NewDailyChallenge,
} from "@/domain/daily-challenge";
import type { DailyChallengeRepository } from "@/repositories/daily-challenge-repository";
import { toDailyChallenge } from "@/repositories/daily-challenge-mapper";

export class PrismaDailyChallengeRepository
  implements DailyChallengeRepository
{
  constructor(private readonly client: PrismaClient) {}

  count(): Promise<number> {
    return this.client.dailyChallenge.count();
  }

  async findAll(): Promise<DailyChallenge[]> {
    const rows = await this.client.dailyChallenge.findMany({ orderBy: { id: "asc" } });
    return rows.map(toDailyChallenge);
  }

  async findById(id: string): Promise<DailyChallenge | null> {
    const row = await this.client.dailyChallenge.findUnique({ where: { id } });
    return row ? toDailyChallenge(row) : null;
  }

  async findByStudyDayId(studyDayId: string): Promise<DailyChallenge[]> {
    const rows = await this.client.dailyChallenge.findMany({
      where: { studyDayId },
    });
    return rows.map(toDailyChallenge);
  }

  async findByStudyDayIds(studyDayIds: string[]): Promise<DailyChallenge[]> {
    const rows = await this.client.dailyChallenge.findMany({
      where: { studyDayId: { in: studyDayIds } },
      orderBy: [{ studyDay: { dayNumber: "asc" } }, { id: "asc" }],
    });
    return rows.map(toDailyChallenge);
  }

  async saveDraft(id: string, userCode: string): Promise<DailyChallenge> {
    const row = await this.client.dailyChallenge.update({
      where: { id },
      data: { userCode },
    });
    return toDailyChallenge(row);
  }

  async markCompleted(id: string, userCode: string): Promise<DailyChallenge> {
    const row = await this.client.dailyChallenge.update({
      where: { id },
      data: { userCode, isCompleted: true },
    });
    return toDailyChallenge(row);
  }

  async syncForStudyDay(
    studyDayId: string,
    challenges: NewDailyChallenge[],
  ): Promise<void> {
    const plannedTitles = challenges.map((challenge) => challenge.title);

    await this.client.$transaction([
      this.client.dailyChallenge.deleteMany({
        where: { studyDayId, title: { notIn: plannedTitles } },
      }),
      ...challenges.map((challenge) =>
        this.client.dailyChallenge.upsert({
          where: { studyDayId_title: { studyDayId, title: challenge.title } },
          create: challenge,
          update: {
            description: challenge.description,
            starterCode: challenge.starterCode,
            hint: challenge.hint,
            solutionCode: challenge.solutionCode,
          },
        }),
      ),
    ]);
  }
}
