import { connection } from "next/server";
import { CalendarDays, Download } from "lucide-react";
import { CalendarGrid } from "@/components/features/calendar-grid";
import { CalendarLegend } from "@/components/features/calendar-legend";
import { CalendarSubscribeCard } from "@/components/features/calendar-subscribe-card";
import { CopySummaryButton } from "@/components/features/copy-summary-button";
import { ModuleProgressPanel } from "@/components/features/module-progress-panel";
import { RescheduleButton } from "@/components/features/reschedule-button";
import { buttonStyles } from "@/components/ui/button-styles";
import { GlassCard } from "@/components/ui/glass-card";
import { APP_TIME_ZONE } from "@/lib/app-config";
import { studyDayRepository } from "@/lib/repositories";
import { getCalendarOverview } from "@/use-cases/get-calendar-overview";

export async function CalendarSection() {
  await connection();
  const overview = await getCalendarOverview(studyDayRepository, new Date(), APP_TIME_ZONE);
  const { progress } = overview;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-white sm:text-3xl">
            <CalendarDays aria-hidden className="size-7 text-violet-300" />
            Calendário 120 Dias
          </h1>
          <p className="text-sm text-slate-300">
            {progress.completedDays} de {progress.totalDays} dias concluídos ({progress.percentage}%)
          </p>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <CopySummaryButton />
          <a href="/api/backup" download className={buttonStyles({ variant: "secondary", size: "md" })}>
            <Download aria-hidden className="size-5" />
            Exportar backup (JSON)
          </a>
          <RescheduleButton size="md" />
        </div>
      </header>

      <GlassCard as="div" ariaLabel="Legenda">
        <CalendarLegend />
      </GlassCard>

      <CalendarGrid months={overview.months} />
      <ModuleProgressPanel modules={overview.modules} />
      <CalendarSubscribeCard />
    </main>
  );
}
