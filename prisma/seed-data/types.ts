import type { StudyDayKind } from "@/domain/study-day-kind";

export interface SeedFlashcard {
  question: string;
  answer: string;
  codeExample?: string;
}

export interface SeedChallenge {
  title: string;
  description: string;
  starterCode?: string;
  hint: string;
  solutionCode: string;
}

export interface DayContext {
  sectionTitle: string;
  moduleTitle: string;
}

export interface SeedDay extends DayContext {
  kind: StudyDayKind;
  topicTitle: string;
  summaryContent: string;
  keyTakeaways: string[];
  tasks: string[];
  flashcards: SeedFlashcard[];
  challenges: SeedChallenge[];
}

export interface SeedPlanDay extends SeedDay {
  dayNumber: number;
  courseLesson: number | null;
}
