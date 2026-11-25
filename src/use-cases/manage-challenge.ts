import type { DailyChallenge } from "@/domain/daily-challenge";
import { NotFoundError } from "@/domain/errors";
import type { DailyChallengeRepository } from "@/repositories/daily-challenge-repository";

async function requireChallenge(
  repository: DailyChallengeRepository,
  challengeId: string,
): Promise<DailyChallenge> {
  const challenge = await repository.findById(challengeId);
  if (!challenge) throw new NotFoundError("Desafio");
  return challenge;
}

export async function saveChallengeDraft(
  repository: DailyChallengeRepository,
  input: { challengeId: string; userCode: string },
): Promise<DailyChallenge> {
  const challenge = await requireChallenge(repository, input.challengeId);
  return repository.saveDraft(challenge.id, input.userCode);
}

export async function completeChallenge(
  repository: DailyChallengeRepository,
  input: { challengeId: string; userCode: string },
): Promise<DailyChallenge> {
  const challenge = await requireChallenge(repository, input.challengeId);
  return repository.markCompleted(challenge.id, input.userCode);
}
