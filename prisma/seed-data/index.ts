import { TOTAL_COURSE_LESSONS, TOTAL_DAYS } from "./config";
import { leetcodeExtrasByDay } from "./leetcode";
import { secao01Javascript } from "./secao-01-javascript";
import { secao02HtmlCssDom } from "./secao-02-html-css-dom";
import { secao03Typescript } from "./secao-03-typescript";
import { secao04ReactTypescript } from "./secao-04-react-typescript";
import { secao05NextjsAppRouter } from "./secao-05-nextjs-app-router";
import { secao06NodejsExpress } from "./secao-06-nodejs-express";
import { secao07Prisma } from "./secao-07-prisma";
import { secao08Nestjs } from "./secao-08-nestjs";
import { secao09PostgresqlRlsAuth } from "./secao-09-postgresql-rls-auth";
import { trilhaLacunas } from "./trilha-lacunas";
import { projetoFinal } from "./projeto-final";
import type { SeedDay, SeedPlanDay } from "./types";

const orderedDays: SeedDay[] = [
  ...secao01Javascript,
  ...secao02HtmlCssDom,
  ...secao03Typescript,
  ...secao04ReactTypescript,
  ...secao05NextjsAppRouter,
  ...secao06NodejsExpress,
  ...secao07Prisma,
  ...secao08Nestjs,
  ...secao09PostgresqlRlsAuth,
  ...trilhaLacunas,
  ...projetoFinal,
];

function buildPlan(days: SeedDay[]): SeedPlanDay[] {
  let lessonCounter = 0;
  return days.map((day, index) => {
    const dayNumber = index + 1;
    const isLesson = day.kind === "AULA";
    if (isLesson) lessonCounter += 1;

    const extra = leetcodeExtrasByDay[dayNumber];
    if (extra && !isLesson) {
      throw new Error("Desafio LeetCode em dia que não é AULA: " + dayNumber);
    }

    return {
      ...day,
      dayNumber,
      courseLesson: isLesson ? lessonCounter : null,
      challenges: extra ? [...day.challenges, extra] : day.challenges,
    };
  });
}

export const seedPlan: SeedPlanDay[] = buildPlan(orderedDays);

const lessonCount = seedPlan.filter((day) => day.kind === "AULA").length;

if (seedPlan.length !== TOTAL_DAYS) {
  throw new Error("O plano deve ter " + TOTAL_DAYS + " dias, mas tem " + seedPlan.length);
}

if (lessonCount !== TOTAL_COURSE_LESSONS) {
  throw new Error(
    "O plano deve ter " + TOTAL_COURSE_LESSONS + " aulas, mas tem " + lessonCount,
  );
}
