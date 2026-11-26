"use client";

import { useState, useTransition } from "react";
import { ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUMMARY_URL = "/api/resumo";

export function CopySummaryButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [fallbackText, setFallbackText] = useState<string | null>(null);

  async function fetchSummary(): Promise<string> {
    const response = await fetch(SUMMARY_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Falha ao gerar o resumo.");
    return response.text();
  }

  function handleCopy() {
    startTransition(async () => {
      let summary: string;
      try {
        summary = await fetchSummary();
      } catch {
        setMessage("Não foi possível gerar o resumo. Tente novamente.");
        return;
      }
      try {
        await navigator.clipboard.writeText(summary);
        setFallbackText(null);
        setMessage("Resumo copiado! Cole no seu projeto de estudos.");
      } catch {
        setFallbackText(summary);
        setMessage("O navegador bloqueou a cópia automática. Copie o texto abaixo.");
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button variant="secondary" size="md" icon={ClipboardCopy} loading={isPending} onClick={handleCopy}>
        Copiar resumo para o curso
      </Button>
      {message ? (
        <p role="status" className="text-sm font-semibold text-white">
          {message}
        </p>
      ) : null}
      {fallbackText ? (
        <textarea
          readOnly
          value={fallbackText}
          rows={10}
          aria-label="Resumo para copiar"
          onFocus={(event) => event.currentTarget.select()}
          className="w-full min-w-72 rounded-2xl border border-white/10 bg-[#111827] p-3 font-mono text-xs text-white"
        />
      ) : null}
    </div>
  );
}
