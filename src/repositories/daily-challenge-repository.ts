import type {
  DailyChallenge,
  NewDailyChallenge,
} from "@/domain/daily-challenge";

export interface DailyChallengeRepository {
  count(): Promise<number>;
  findById(id: string): Promise<DailyChallenge | null>;
  findByStudyDayId(studyDayId: string): Promise<DailyChallenge[]>;
  findByStudyDayIds(studyDayIds: string[]): Promise<DailyChallenge[]>;
  saveDraft(id: string, userCode: string): Promise<DailyChallenge>;
  markCompleted(id: string, userCode: string): Promise<DailyChallenge>;
  createMissingForStudyDay(
    studyDayId: string,
    challenges: NewDailyChallenge[],
  ): Promise<void>;
}
