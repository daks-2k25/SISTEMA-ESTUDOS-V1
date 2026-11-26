import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ImportPreview } from "@/services/flashcard-import-plan";

const PREVIEW_LIMIT = 20;

interface PreviewListProps {
  title: string;
  tone: string;
  items: ReactNode[];
}

function PreviewList({ title, tone, items }: PreviewListProps) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-2">
      <h3 className={cn("text-sm font-bold", tone)}>{title}</h3>
      <ul className="space-y-1 text-sm text-slate-300">
        {items.slice(0, PREVIEW_LIMIT).map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      {items.length > PREVIEW_LIMIT ? (
        <p className="text-xs text-slate-400">e mais {items.length - PREVIEW_LIMIT}.</p>
      ) : null}
    </section>
  );
}

function lineLabel(line: number): string {
  return line === 0 ? "Arquivo" : "Linha " + line;
}

export function ImportPreviewPanel({ preview }: { preview: ImportPreview }) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
        <span className="text-emerald-300">{preview.valid.length} válidos</span>
        <span className="text-amber-300">{preview.duplicates.length} duplicados</span>
        <span className="text-rose-300">{preview.errors.length} com erro</span>
      </p>

      <PreviewList
        title="Com erro (não serão importados)"
        tone="text-rose-300"
        items={preview.errors.map((error) => lineLabel(error.line) + ": " + error.reason)}
      />
      <PreviewList
        title="Duplicados (mesma pergunta no mesmo dia, serão ignorados)"
        tone="text-amber-300"
        items={preview.duplicates.map((card) => lineLabel(card.line) + ": " + card.question)}
      />
      <PreviewList
        title="Serão importados"
        tone="text-emerald-300"
        items={preview.valid.map((card) => "Dia " + card.targetDayNumber + ": " + card.question)}
      />
    </div>
  );
}
