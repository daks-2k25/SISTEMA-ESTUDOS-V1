"use server";

import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { runAction } from "@/actions/run-action";
import { dailyChallengeRepository } from "@/lib/repositories";
import {
  completeChallenge as completeChallengeUseCase,
  saveChallengeDraft,
} from "@/use-cases/manage-challenge";

const MAX_CODE_LENGTH = 50000;

const challengeCodeSchema = z.object({
  challengeId: z.string().min(1),
  userCode: z.string().max(MAX_CODE_LENGTH),
});

export async function saveDraft(input: unknown): Promise<ActionResult<null>> {
  return runAction({
    schema: challengeCodeSchema,
    input,
    shouldRevalidate: false,
    handler: async (data) => {
      await saveChallengeDraft(dailyChallengeRepository, data);
      return null;
    },
  });
}

export async function completeChallenge(
  input: unknown,
): Promise<ActionResult<null>> {
  return runAction({
    schema: challengeCodeSchema,
    input,
    handler: async (data) => {
      await completeChallengeUseCase(dailyChallengeRepository, data);
      return null;
    },
  });
}
