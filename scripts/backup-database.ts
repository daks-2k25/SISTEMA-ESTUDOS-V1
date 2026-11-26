import "../prisma/env-setup";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "@/lib/prisma";
import { PrismaDailyChallengeRepository } from "@/repositories/prisma-daily-challenge-repository";
import { PrismaFlashcardRepository } from "@/repositories/prisma-flashcard-repository";
import { PrismaStudyDayRepository } from "@/repositories/prisma-study-day-repository";
import { backupFileName, exportBackup } from "@/use-cases/export-backup";

const BACKUP_FOLDER = "backups";

async function main(): Promise<void> {
  const now = new Date();
  const backup = await exportBackup(
    {
      studyDays: new PrismaStudyDayRepository(prisma),
      flashcards: new PrismaFlashcardRepository(prisma),
      challenges: new PrismaDailyChallengeRepository(prisma),
    },
    now,
  );

  mkdirSync(BACKUP_FOLDER, { recursive: true });
  const filePath = join(BACKUP_FOLDER, backupFileName(now));
  writeFileSync(filePath, JSON.stringify(backup, null, 2));

  console.log(
    "Backup salvo em " + filePath + ":",
    backup.studyDays.length + " dias,",
    backup.flashcards.length + " flashcards,",
    backup.challenges.length + " desafios.",
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
