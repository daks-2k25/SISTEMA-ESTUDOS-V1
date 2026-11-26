export interface LoginAttemptRepository {
  countSince(ip: string, since: Date): Promise<number>;
  record(ip: string, attemptedAt: Date): Promise<void>;
  clear(ip: string): Promise<void>;
  deleteBefore(date: Date): Promise<void>;
}
