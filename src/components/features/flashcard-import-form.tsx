"use client";

import { useState, useTransition } from "react";
import { Eye, Upload } from "lucide-react";
import { previewImport, runImport } from "@/actions/flashcard-import-actions";
import { ImportPreviewPanel } from "@/components/features/import-preview-panel";
import { Button } from "@/components/ui/button";
import type { ImportPreview } from "@/services/flashcard-import-plan";

export function FlashcardImportForm() {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleTextChange(value: string) {
    setText(value);
    setPreview(null);
    setMessage(null);
  }

  function handlePreview() {
    startTransition(async () => {
      const result = await previewImport({ text });
      setPreview(result.ok ? result.data : null);
      setMessage(result.ok ? null : result.error);
    });
  }

  function handleImport() {
    startTransition(async () => {
      const result = await runImport({ text });
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setText("");
      setPreview(null);
      setMessage(result.data.imported + " flashcards importados.");
    });
  }

  const canImport = preview !== null && preview.valid.length > 0;

  return (
    <div className="space-y-4">
      <label htmlFor="texto-importacao" className="text-sm font-semibold text-slate-200">
        Cole aqui o JSON ou o CSV
      </label>
      <textarea
        id="texto-importacao"
        value={text}
        onChange={(event) => handleTextChange(event.target.value)}
        rows={12}
        spellCheck={false}
        className="w-full rounded-2xl border border-white/10 bg-[#111827] p-4 font-mono text-sm text-white"
      />

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" icon={Eye} loading={isPending && !preview} disabled={text.trim() === ""} onClick={handlePreview}>
          Pré-visualizar
        </Button>
        <Button icon={Upload} loading={isPending && canImport} disabled={!canImport} onClick={handleImport}>
          Importar {canImport ? preview.valid.length + " cards" : ""}
        </Button>
      </div>

      {message ? (
        <p role="status" className="text-sm font-semibold text-slate-100">
          {message}
        </p>
      ) : null}

      {preview ? <ImportPreviewPanel preview={preview} /> : null}
    </div>
  );
}
