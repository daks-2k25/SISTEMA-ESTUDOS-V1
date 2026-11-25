import type {
  ChecklistTask,
  NewStudyDay,
  ScheduledDateUpdate,
  StudyDay,
  StudyDayWithRelations,
} from "@/domain/study-day";

export interface CompletionUpdate {
  isCompleted: boolean;
  completedAt: Date | null;
}

export interface StudyDayRepository {
  count(): Promise<number>;
  findById(id: string): Promise<StudyDay | null>;
  findByDayNumber(dayNumber: number): Promise<StudyDayWithRelations | null>;
  findAll(): Promise<StudyDay[]>;
  upsertByDayNumber(data: NewStudyDay): Promise<StudyDay>;
  updateChecklist(id: string, tasks: ChecklistTask[]): Promise<StudyDay>;
  updateNotes(id: string, notes: string): Promise<StudyDay>;
  addMinutesStudied(id: string, minutes: number): Promise<StudyDay>;
  updateCompletion(id: string, update: CompletionUpdate): Promise<StudyDay>;
  updateScheduledDates(updates: ScheduledDateUpdate[]): Promise<void>;
}
