"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useTransition } from "react";
import { CheckCircle2, ClipboardCopy, Save } from "lucide-react";
import { completeChallenge, saveDraft } from "@/actions/challenge-actions";
import { Button } from "@/components/ui/button";
import { CardTitle, GlassCard } from "@/components/ui/glass-card";
import { Toast } from "@/components/ui/toast";
import { buildReviewPrompt } from "@/services/review-prompt";

const CodeEditor = dynamic(() => import("@/components/features/code-editor"), {
  ssr: false,
  loading: () => (
    <div
      aria-busy
      className="h-[380px] animate-pulse rounded-2xl border border-white/10 bg-white/5"
    />
  ),
});

type SaveStatus = "idle" | "saved" | "error";

const TOAST_DURATION_MS = 2500;

interface ChallengeEditorProps {
  challengeId: string;
  title: string;
  description: string;
  initialCode: string;
  isCompleted: boolean;
}

export function ChallengeEditor({
  challengeId,
  title,
  description,
  initialCode,
  isCompleted,
}: ChallengeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isCompleting, startCompleting] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string) {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }

  function handleSave() {
    startSaving(async () => {
      const result = await saveDraft({ challengeId, userCode: code });
      setStatus(result.ok ? "saved" : "error");
      setError(result.ok ? null : result.error);
      if (result.ok) showToast("Rascunho salvo!");
    });
  }

  function handleComplete() {
    startCompleting(async () => {
      const result = await completeChallenge({ challengeId, userCode: code });
      setError(result.ok ? null : result.error);
      if (result.ok) showToast("Desafio concluído!");
    });
  }

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(
        buildReviewPrompt({ title, description, userCode: code }),
      );
      showToast("Copiado!");
    } catch {
      setError("Não foi possível copiar. Verifique a permissão da área de transferência.");
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isSaveShortcut =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s";
      if (!isSaveShortcut) return;
      event.preventDefault();
      handleSave();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  function handleChange(value: string) {
    setCode(value);
    setStatus("idle");
  }

  return (
    <GlassCard ariaLabel="Editor de código" className="min-w-0">
      <CardTitle
        action={
          <span role="status" className="text-sm font-semibold text-slate-300">
            {status === "saved" ? "Rascunho salvo" : null}
            {status === "error" ? "Falha ao salvar" : null}
          </span>
        }
      >
        Seu código
      </CardTitle>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <CodeEditor
          value={code}
          onChange={handleChange}
          ariaLabel={"Editor de código do desafio: " + title}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Button icon={Save} variant="secondary" loading={isSaving} onClick={handleSave}>
          Salvar Rascunho
        </Button>
        <Button icon={ClipboardCopy} variant="secondary" onClick={handleCopyPrompt}>
          Copiar Prompt p/ Revisão IA
        </Button>
      </div>
      <Button
        icon={CheckCircle2}
        fullWidth
        className="mt-3"
        loading={isCompleting}
        disabled={isCompleted}
        onClick={handleComplete}
      >
        {isCompleted ? "Desafio concluído ✓" : "Concluir Desafio ✓"}
      </Button>
      <p className="mt-3 text-center text-sm text-slate-400">
        Atalho: <kbd className="rounded bg-white/10 px-1.5">Ctrl</kbd> +{" "}
        <kbd className="rounded bg-white/10 px-1.5">S</kbd> salva o rascunho
      </p>

      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-rose-300">
          {error}
        </p>
      ) : null}
      <Toast message={toast} />
    </GlassCard>
  );
}
