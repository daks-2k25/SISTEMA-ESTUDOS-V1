/*
  Warnings:

  - Added the required column `kind` to the `StudyDay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectionTitle` to the `StudyDay` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudyDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayNumber" INTEGER NOT NULL,
    "scheduledDate" DATETIME NOT NULL,
    "sectionTitle" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "courseLesson" INTEGER,
    "moduleTitle" TEXT NOT NULL,
    "topicTitle" TEXT NOT NULL,
    "summaryContent" TEXT NOT NULL,
    "keyTakeaways" TEXT NOT NULL,
    "checklistTasks" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "minutesStudied" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT
);
INSERT INTO "new_StudyDay" ("checklistTasks", "completedAt", "dayNumber", "id", "isCompleted", "keyTakeaways", "minutesStudied", "moduleTitle", "notes", "scheduledDate", "summaryContent", "topicTitle") SELECT "checklistTasks", "completedAt", "dayNumber", "id", "isCompleted", "keyTakeaways", "minutesStudied", "moduleTitle", "notes", "scheduledDate", "summaryContent", "topicTitle" FROM "StudyDay";
DROP TABLE "StudyDay";
ALTER TABLE "new_StudyDay" RENAME TO "StudyDay";
CREATE UNIQUE INDEX "StudyDay_dayNumber_key" ON "StudyDay"("dayNumber");
CREATE INDEX "StudyDay_scheduledDate_idx" ON "StudyDay"("scheduledDate");
CREATE INDEX "StudyDay_isCompleted_idx" ON "StudyDay"("isCompleted");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
