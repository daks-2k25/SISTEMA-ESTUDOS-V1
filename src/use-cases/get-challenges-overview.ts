import type { DailyChallenge } from "@/domain/daily-challenge";
import type { StudyDaySummary } from "@/domain/study-day";
import type { DailyChallengeRepository } from "@/repositories/daily-challenge-repository";
import type { StudyDayRepository } from "@/repositories/study-day-repository";
import {
  chooseChallengeId,
  findAdjacentChallengeIds,
} from "@/services/challenge-selection";
import { chooseDayNumber } from "@/services/day-selection";
import { isDayReleased } from "@/services/release";

export interface ChallengeListItem {
  id: string;
  title: string;
  dayNumber: number;
  topicTitle: string;
  isCompleted: boolean;
}

export interface SelectedChallenge extends ChallengeListItem {
  description: string;
  starterCode: string | null;
  hint: string;
  solutionCode: string;
  userCode: string | null;
}

export interface ChallengesOverview {
  items: ChallengeListItem[];
  selected: SelectedChallenge | null;
  previousId: string | null;
  nextId: string | null;
  currentDayNumber: number | null;
}

interface ChallengesRepositories {
  studyDays: StudyDayRepository;
  challenges: DailyChallengeRepository;
}

export interface ChallengesQuery {
  requestedId: string | null;
  now: Date;
  timeZone: string;
}

function accessibleDays(
  days: StudyDaySummary[],
  currentDayNumber: number | null,
  now: Date,
  timeZone: string,
): StudyDaySummary[] {
  return days.filter(
    (day) =>
      day.dayNumber === currentDayNumber || isDayReleased(day, now, timeZone),
  );
}

function toListItem(challenge: DailyChallenge, day: StudyDaySummary): ChallengeListItem {
  return {
    id: challenge.id,
    title: challenge.title,
    dayNumber: day.dayNumber,
    topicTitle: day.topicTitle,
    isCompleted: challenge.isCompleted,
  };
}

export async function getChallengesOverview(
  repositories: ChallengesRepositories,
  query: ChallengesQuery,
): Promise<ChallengesOverview> {
  const days = await repositories.studyDays.findSummaries();
  const currentDayNumber = chooseDayNumber(null, days);
  const available = accessibleDays(days, currentDayNumber, query.now, query.timeZone);
  const dayById = new Map(available.map((day) => [day.id, day]));

  const challenges = await repositories.challenges.findByStudyDayIds([...dayById.keys()]);
  const entries = challenges
    .map((challenge) => ({ challenge, day: dayById.get(challenge.studyDayId) }))
    .filter((entry): entry is { challenge: DailyChallenge; day: StudyDaySummary } => entry.day !== undefined)
    .sort((first, second) => first.day.dayNumber - second.day.dayNumber);

  const items = entries.map((entry) => toListItem(entry.challenge, entry.day));
  const selectedId = chooseChallengeId(items, query.requestedId, currentDayNumber);
  const selectedEntry = entries.find((entry) => entry.challenge.id === selectedId);

  if (!selectedEntry || selectedId === null) {
    return { items, selected: null, previousId: null, nextId: null, currentDayNumber };
  }

  const { previousId, nextId } = findAdjacentChallengeIds(items, selectedId);
  return {
    items,
    selected: {
      ...toListItem(selectedEntry.challenge, selectedEntry.day),
      description: selectedEntry.challenge.description,
      starterCode: selectedEntry.challenge.starterCode,
      hint: selectedEntry.challenge.hint,
      solutionCode: selectedEntry.challenge.solutionCode,
      userCode: selectedEntry.challenge.userCode,
    },
    previousId,
    nextId,
    currentDayNumber,
  };
}
