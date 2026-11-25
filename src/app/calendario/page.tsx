import { Suspense } from "react";
import { CalendarSection } from "@/components/features/calendar-section";

export default function CalendarPage() {
  return (
    <Suspense
      fallback={
        <p className="px-6 py-10 text-center text-slate-400">Carregando calendário...</p>
      }
    >
      <CalendarSection />
    </Suspense>
  );
}
