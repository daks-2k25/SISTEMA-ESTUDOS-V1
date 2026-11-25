-- CreateTable
CREATE TABLE "StudyDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayNumber" INTEGER NOT NULL,
    "scheduledDate" DATETIME NOT NULL,
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

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studyDayId" TEXT NOT NULL,
    "moduleTitle" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "codeExample" TEXT,
    "nextReviewAt" DATETIME NOT NULL,
    "intervalDays" INTEGER NOT NULL DEFAULT 1,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Flashcard_studyDayId_fkey" FOREIGN KEY ("studyDayId") REFERENCES "StudyDay" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyChallenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studyDayId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "starterCode" TEXT,
    "hint" TEXT NOT NULL,
    "solutionCode" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userCode" TEXT,
    CONSTRAINT "DailyChallenge_studyDayId_fkey" FOREIGN KEY ("studyDayId") REFERENCES "StudyDay" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "StudyDay_dayNumber_key" ON "StudyDay"("dayNumber");

-- CreateIndex
CREATE INDEX "StudyDay_scheduledDate_idx" ON "StudyDay"("scheduledDate");

-- CreateIndex
CREATE INDEX "StudyDay_isCompleted_idx" ON "StudyDay"("isCompleted");

-- CreateIndex
CREATE INDEX "Flashcard_nextReviewAt_idx" ON "Flashcard"("nextReviewAt");

-- CreateIndex
CREATE INDEX "DailyChallenge_isCompleted_idx" ON "DailyChallenge"("isCompleted");
