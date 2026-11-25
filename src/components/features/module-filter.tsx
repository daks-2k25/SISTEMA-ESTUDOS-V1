"use client";

import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";

interface ModuleFilterProps {
  moduleTitles: string[];
  selectedModule: string;
  currentDayNumber: number;
}

export function ModuleFilter({
  moduleTitles,
  selectedModule,
  currentDayNumber,
}: ModuleFilterProps) {
  const router = useRouter();

  function handleChange(moduleTitle: string) {
    const params = new URLSearchParams({
      dia: String(currentDayNumber),
      modulo: moduleTitle,
    });
    router.push("/?" + params.toString());
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="filtro-modulo"
        className="flex items-center gap-2 text-sm font-semibold text-slate-200"
      >
        <Filter aria-hidden className="size-4" />
        Filtrar por módulo
      </label>
      <select
        id="filtro-modulo"
        value={selectedModule}
        onChange={(event) => handleChange(event.target.value)}
        className="min-h-12 w-full rounded-2xl border border-white/10 bg-[#111827] px-4 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
      >
        {moduleTitles.map((title) => (
          <option key={title} value={title}>
            {title}
          </option>
        ))}
      </select>
    </div>
  );
}
