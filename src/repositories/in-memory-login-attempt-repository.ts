import type { LoginAttemptRepository } from "@/repositories/login-attempt-repository";

interface StoredAttempt {
  ip: string;
  attemptedAt: Date;
}

export class InMemoryLoginAttemptRepository implements LoginAttemptRepository {
  private attempts: StoredAttempt[] = [];

  async countSince(ip: string, since: Date): Promise<number> {
    return this.attempts.filter(
      (attempt) => attempt.ip === ip && attempt.attemptedAt >= since,
    ).length;
  }

  async record(ip: string, attemptedAt: Date): Promise<void> {
    this.attempts.push({ ip, attemptedAt });
  }

  async clear(ip: string): Promise<void> {
    this.attempts = this.attempts.filter((attempt) => attempt.ip !== ip);
  }

  async deleteBefore(date: Date): Promise<void> {
    this.attempts = this.attempts.filter((attempt) => attempt.attemptedAt >= date);
  }
}
