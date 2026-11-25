"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, NotebookPen } from "lucide-react";
import { saveNotes } from "@/actions/study-day-actions";
import { CardTitle, GlassCard } from "@/components/ui/glass-card";
import { useDebouncedCallback } from "@/lib/use-debounced-callback";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_DELAY_MS = 800;

const STATUS_LABELS: Record<SaveStatus, string> = {
  idle: "",
  saving: "Salvando…",
  saved: "Salvo",
  error: "Não foi possível salvar",
};

interface NotesCardProps {
  studyDayId: string;
  initialNotes: string;
}

export function NotesCard({ studyDayId, initialNotes }: NotesCardProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [status, setStatus] = useState<SaveStatus>("idle");

  const autosave = useDebouncedCallback(async (value: string) => {
    const result = await saveNotes({ studyDayId, notes: value });
    setStatus(result.ok ? "saved" : "error");
  }, AUTOSAVE_DELAY_MS);

  function handleChange(value: string) {
    setNotes(value);
    setStatus("saving");
    autosave.schedule(value);
  }

  return (
    <GlassCard ariaLabel="Notas do dia">
      <CardTitle
        icon={<NotebookPen aria-hidden className="size-5 text-violet-300" />}
        action={
          <span
            role="status"
            aria-live="polite"
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-300"
          >
            {status === "saving" ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : null}
            {status === "saved" ? (
              <CheckCircle2 aria-hidden className="size-4 text-emerald-400" />
            ) : null}
            {STATUS_LABELS[status]}
          </span>
        }
      >
        Notas do dia
      </CardTitle>
      <label htmlFor="notas-do-dia" className="sr-only">
        Anotações sobre o estudo de hoje
      </label>
      <textarea
        id="notas-do-dia"
        value={notes}
        onChange={(event) => handleChange(event.target.value)}
        rows={7}
        placeholder="O que você aprendeu? Dúvidas, ideias e links..."
        className="w-full resize-y rounded-2xl border border-white/10 bg-[#111827] p-4 text-sm leading-relaxed text-white placeholder:text-slate-400"
      />
    </GlassCard>
  );
}
