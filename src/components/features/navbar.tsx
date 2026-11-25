import Link from "next/link";
import { connection } from "next/server";
import { Flame, GraduationCap } from "lucide-react";
import { NavTabs } from "@/components/features/nav-tabs";
import { ProgressBar } from "@/components/ui/progress-bar";
import { APP_TIME_ZONE } from "@/lib/app-config";
import { flashcardRepository, studyDayRepository } from "@/lib/repositories";
import { getNavbarSummary } from "@/use-cases/get-navbar-summary";

function NavbarFrame({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0F19]/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        {children}
      </div>
    </header>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-xl text-xl font-extrabold text-white"
    >
      <span className="rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 p-2">
        <GraduationCap aria-hidden className="size-5" />
      </span>
      DevJr 120
    </Link>
  );
}

export function NavbarFallback() {
  return (
    <NavbarFrame>
      <Logo />
      <p className="text-sm text-slate-400">Carregando progresso...</p>
    </NavbarFrame>
  );
}

export async function Navbar() {
  await connection();
  const summary = await getNavbarSummary(
    { studyDays: studyDayRepository, flashcards: flashcardRepository },
    new Date(),
    APP_TIME_ZONE,
  );
  const { progress, streak, dueFlashcards } = summary;

  return (
    <NavbarFrame>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Logo />
        <div className="flex min-w-0 basis-full flex-col gap-1.5 sm:max-w-md sm:flex-1 sm:basis-auto">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="whitespace-nowrap font-bold text-white">
              {progress.completedDays} / {progress.totalDays}
            </span>
            <span className="whitespace-nowrap text-slate-300">
              Aula {progress.completedLessons} / {progress.totalLessons}
            </span>
            <span
              className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-amber-300"
              title="Dias consecutivos concluídos"
            >
              <Flame aria-hidden className="size-4" />
              {streak} {streak === 1 ? "dia" : "dias"}
            </span>
          </div>
          <ProgressBar
            value={progress.percentage}
            label={"Progresso do curso: " + progress.percentage + "%"}
          />
        </div>
      </div>
      <NavTabs dueFlashcards={dueFlashcards} />
    </NavbarFrame>
  );
}
