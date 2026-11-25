export interface DailyChallenge {
  id: string;
  studyDayId: string;
  title: string;
  description: string;
  starterCode: string | null;
  hint: string;
  solutionCode: string;
  isCompleted: boolean;
  userCode: string | null;
}

export interface NewDailyChallenge {
  studyDayId: string;
  title: string;
  description: string;
  starterCode: string | null;
  hint: string;
  solutionCode: string;
}
