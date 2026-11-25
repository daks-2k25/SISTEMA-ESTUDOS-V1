import "./env-setup";
import { prisma } from "@/lib/prisma";
import { PrismaStudyDayRepository } from "@/repositories/prisma-study-day-repository";
import { PrismaFlashcardRepository } from "@/repositories/prisma-flashcard-repository";
import { PrismaDailyChallengeRepository } from "@/repositories/prisma-daily-challenge-repository";
import type { StudyDayRepository } from "@/repositories/study-day-repository";
import type { FlashcardRepository } from "@/repositories/flashcard-repository";
import type { DailyChallengeRepository } from "@/repositories/daily-challenge-repository";
import type { ChecklistTask } from "@/domain/study-day";
import { COURSE_LESSONS_DONE, scheduledDateFor } from "./seed-data/config";
import { seedPlan } from "./seed-data";
import type { SeedPlanDay } from "./seed-data/types";

interface SeedRepositories {
  studyDays: StudyDayRepository;
  flashcards: FlashcardRepository;
  challenges: DailyChallengeRepository;
}

function isAlreadyStudied(day: SeedPlanDay): boolean {
  return day.courseLesson !== null && day.courseLesson <= COURSE_LESSONS_DONE;
}

function buildChecklist(day: SeedPlanDay, done: boolean): ChecklistTask[] {
  return day.tasks.map((label, index) => ({
    id: "dia-" + day.dayNumber + "-tarefa-" + (index + 1),
    label,
    done,
    isCustom: false,
  }));
}

async function seedDay(
  repositories: SeedRepositories,
  day: SeedPlanDay,
  now: Date,
): Promise<void> {
  const scheduledDate = scheduledDateFor(day.dayNumber);
  const studied = isAlreadyStudied(day);

  const studyDay = await repositories.studyDays.upsertByDayNumber({
    dayNumber: day.dayNumber,
    scheduledDate,
    sectionTitle: day.sectionTitle,
    kind: day.kind,
    courseLesson: day.courseLesson,
    moduleTitle: day.moduleTitle,
    topicTitle: day.topicTitle,
    summaryContent: day.summaryContent,
    keyTakeaways: day.keyTakeaways,
    checklistTasks: buildChecklist(day, studied),
    isCompleted: studied,
    completedAt: studied ? scheduledDate : null,
  });

  await repositories.flashcards.createMissingForStudyDay(
    studyDay.id,
    day.flashcards.map((card) => ({
      studyDayId: studyDay.id,
      moduleTitle: day.moduleTitle,
      question: card.question,
      answer: card.answer,
      codeExample: card.codeExample ?? null,
      nextReviewAt: studied ? now : scheduledDate,
    })),
  );

  await repositories.challenges.createMissingForStudyDay(
    studyDay.id,
    day.challenges.map((challenge) => ({
      studyDayId: studyDay.id,
      title: challenge.title,
      description: challenge.description,
      starterCode: challenge.starterCode ?? null,
      hint: challenge.hint,
      solutionCode: challenge.solutionCode,
    })),
  );
}

async function main(): Promise<void> {
  const repositories: SeedRepositories = {
    studyDays: new PrismaStudyDayRepository(prisma),
    flashcards: new PrismaFlashcardRepository(prisma),
    challenges: new PrismaDailyChallengeRepository(prisma),
  };
  const now = new Date();

  for (const day of seedPlan) {
    await seedDay(repositories, day, now);
  }

  const totals = {
    dias: await repositories.studyDays.count(),
    flashcards: await repositories.flashcards.count(),
    desafios: await repositories.challenges.count(),
  };
  console.log("Seed concluído:", totals);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
