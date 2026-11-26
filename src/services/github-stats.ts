import type { GithubPush, GithubRepository } from "@/domain/github-activity";
import { addDays, startOfCalendarDay } from "@/services/dates";
import { calculateStreak } from "@/services/streak";

export const RECENT_REPOSITORIES_LIMIT = 5;
const RECENT_COMMITS_DAYS = 7;

function pushDates(pushes: GithubPush[]): Date[] {
  return pushes.map((push) => new Date(push.createdAt));
}

export function hasPushToday(pushes: GithubPush[], now: Date, timeZone: string): boolean {
  const today = startOfCalendarDay(now, timeZone).getTime();
  return pushDates(pushes).some((date) => startOfCalendarDay(date, timeZone).getTime() === today);
}

export function commitsInLastWeek(pushes: GithubPush[], now: Date, timeZone: string): number {
  const firstDay = addDays(startOfCalendarDay(now, timeZone), -(RECENT_COMMITS_DAYS - 1)).getTime();
  return pushes
    .filter((push) => startOfCalendarDay(new Date(push.createdAt), timeZone).getTime() >= firstDay)
    .reduce((total, push) => total + push.commits, 0);
}

export function pushStreak(pushes: GithubPush[], now: Date, timeZone: string): number {
  return calculateStreak(pushDates(pushes), now, timeZone);
}

export function latestRepositories(repositories: GithubRepository[]): GithubRepository[] {
  return [...repositories]
    .sort((first, second) => second.pushedAt.localeCompare(first.pushedAt))
    .slice(0, RECENT_REPOSITORIES_LIMIT);
}
