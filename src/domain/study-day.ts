import type { Flashcard } from "@/domain/flashcard";
import type { DailyChallenge } from "@/domain/daily-challenge";
import type { StudyDayKind } from "@/domain/study-day-kind";

export interface ChecklistTask {
  id: string;
  label: string;
  done: boolean;
  isCustom: boolean;
}

export interface StudyDay {
  id: string;
  dayNumber: number;
  scheduledDate: Date;
  sectionTitle: string;
  kind: StudyDayKind;
  courseLesson: number | null;
  moduleTitle: string;
  topicTitle: string;
  summaryContent: string;
  keyTakeaways: string[];
  checklistTasks: ChecklistTask[];
  isCompleted: boolean;
  completedAt: Date | null;
  minutesStudied: number;
  notes: string | null;
}

export interface StudyDayWithRelations extends StudyDay {
  flashcards: Flashcard[];
  challenges: DailyChallenge[];
}

export interface NewStudyDay {
  dayNumber: number;
  scheduledDate: Date;
  sectionTitle: string;
  kind: StudyDayKind;
  courseLesson: number | null;
  moduleTitle: string;
  topicTitle: string;
  summaryContent: string;
  keyTakeaways: string[];
  checklistTasks: ChecklistTask[];
  isCompleted: boolean;
  completedAt: Date | null;
}

export interface ScheduledDateUpdate {
  id: string;
  scheduledDate: Date;
}
