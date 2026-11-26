import { prisma } from "@/lib/prisma";
import { PrismaStudyDayRepository } from "@/repositories/prisma-study-day-repository";
import { PrismaFlashcardRepository } from "@/repositories/prisma-flashcard-repository";
import { PrismaDailyChallengeRepository } from "@/repositories/prisma-daily-challenge-repository";
import { PrismaLoginAttemptRepository } from "@/repositories/prisma-login-attempt-repository";

export const studyDayRepository = new PrismaStudyDayRepository(prisma);
export const flashcardRepository = new PrismaFlashcardRepository(prisma);
export const dailyChallengeRepository = new PrismaDailyChallengeRepository(
  prisma,
);
export const loginAttemptRepository = new PrismaLoginAttemptRepository(prisma);
