import type { DailyChallenge as DailyChallengeRow } from "@prisma/client";
import type { DailyChallenge } from "@/domain/daily-challenge";

export function toDailyChallenge(row: DailyChallengeRow): DailyChallenge {
  return {
    id: row.id,
    studyDayId: row.studyDayId,
    title: row.title,
    description: row.description,
    starterCode: row.starterCode,
    hint: row.hint,
    solutionCode: row.solutionCode,
    isCompleted: row.isCompleted,
    userCode: row.userCode,
  };
}
