import type { PrismaClient } from "@prisma/client";
import type { LoginAttemptRepository } from "@/repositories/login-attempt-repository";

export class PrismaLoginAttemptRepository implements LoginAttemptRepository {
  constructor(private readonly client: PrismaClient) {}

  countSince(ip: string, since: Date): Promise<number> {
    return this.client.loginAttempt.count({
      where: { ip, attemptedAt: { gte: since } },
    });
  }

  async record(ip: string, attemptedAt: Date): Promise<void> {
    await this.client.loginAttempt.create({ data: { ip, attemptedAt } });
  }

  async clear(ip: string): Promise<void> {
    await this.client.loginAttempt.deleteMany({ where: { ip } });
  }

  async deleteBefore(date: Date): Promise<void> {
    await this.client.loginAttempt.deleteMany({
      where: { attemptedAt: { lt: date } },
    });
  }
}
