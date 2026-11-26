-- AlterTable
ALTER TABLE "StudyDay" ADD COLUMN "difficulties" TEXT,
ADD COLUMN "quizScore" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "DailyChallenge_studyDayId_title_key" ON "DailyChallenge"("studyDayId", "title");
