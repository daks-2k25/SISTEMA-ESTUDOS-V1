-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "StudyDay" (
    "id" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "sectionTitle" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "courseLesson" INTEGER,
    "moduleTitle" TEXT NOT NULL,
    "topicTitle" TEXT NOT NULL,
    "summaryContent" TEXT NOT NULL,
    "keyTakeaways" TEXT NOT NULL,
    "checklistTasks" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "minutesStudied" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "StudyDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "studyDayId" TEXT NOT NULL,
    "moduleTitle" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "codeExample" TEXT,
    "nextReviewAt" TIMESTAMP(3) NOT NULL,
    "intervalDays" INTEGER NOT NULL DEFAULT 1,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyChallenge" (
    "id" TEXT NOT NULL,
    "studyDayId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "starterCode" TEXT,
    "hint" TEXT NOT NULL,
    "solutionCode" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userCode" TEXT,

    CONSTRAINT "DailyChallenge_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_studyDayId_fkey" FOREIGN KEY ("studyDayId") REFERENCES "StudyDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyChallenge" ADD CONSTRAINT "DailyChallenge_studyDayId_fkey" FOREIGN KEY ("studyDayId") REFERENCES "StudyDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

