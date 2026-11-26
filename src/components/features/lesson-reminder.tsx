import { MonitorPlay } from "lucide-react";

export function LessonReminder() {
  return (
    <aside
      aria-label="Aviso da aula"
      className="flex items-center gap-3 rounded-3xl border border-sky-400/30 bg-sky-500/10 px-5 py-4 text-sky-100"
    >
      <MonitorPlay aria-hidden className="size-6 shrink-0 text-sky-300" />
      <p className="font-semibold">Faça esta aula no projeto do curso e volte para registrar.</p>
    </aside>
  );
}
