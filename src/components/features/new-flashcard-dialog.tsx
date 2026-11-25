"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { Plus, Save, X } from "lucide-react";
import { createFlashcard } from "@/actions/flashcard-actions";
import { Button } from "@/components/ui/button";

export interface DayOption {
  id: string;
  label: string;
}

interface NewFlashcardDialogProps {
  days: DayOption[];
  defaultDayId: string;
}

const FIELD_CLASS =
  "w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white placeholder:text-slate-400";

export function NewFlashcardDialog({ days, defaultDayId }: NewFlashcardDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState(false);
  const [isPending, startTransition] = useTransition();

  function open() {
    setError(null);
    setCreated(false);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createFlashcard({
        studyDayId: String(data.get("studyDayId") ?? ""),
        question: String(data.get("question") ?? ""),
        answer: String(data.get("answer") ?? ""),
        codeExample: String(data.get("codeExample") ?? ""),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }
      formRef.current?.reset();
      setCreated(true);
      close();
    });
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Button icon={Plus} onClick={open}>
          Novo Flashcard
        </Button>
        {created ? (
          <span role="status" className="text-sm font-semibold text-emerald-300">
            Flashcard criado!
          </span>
        ) : null}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="titulo-novo-flashcard"
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        className="m-auto w-[min(92vw,38rem)] rounded-3xl border border-white/10 bg-[#0f1424] p-0 text-white backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="titulo-novo-flashcard" className="text-xl font-extrabold">
              Novo flashcard
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="flashcard-dia" className="text-sm font-semibold text-slate-200">
              Dia
            </label>
            <select
              id="flashcard-dia"
              name="studyDayId"
              defaultValue={defaultDayId}
              required
              className={FIELD_CLASS}
            >
              {days.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="flashcard-pergunta" className="text-sm font-semibold text-slate-200">
              Pergunta
            </label>
            <textarea
              id="flashcard-pergunta"
              name="question"
              required
              minLength={3}
              maxLength={500}
              rows={2}
              className={FIELD_CLASS}
              placeholder="Ex.: O que é uma closure?"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="flashcard-resposta" className="text-sm font-semibold text-slate-200">
              Resposta
            </label>
            <textarea
              id="flashcard-resposta"
              name="answer"
              required
              maxLength={4000}
              rows={3}
              className={FIELD_CLASS}
              placeholder="Explique com suas palavras"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="flashcard-codigo" className="text-sm font-semibold text-slate-200">
              Código (opcional)
            </label>
            <textarea
              id="flashcard-codigo"
              name="codeExample"
              maxLength={4000}
              rows={4}
              spellCheck={false}
              className={FIELD_CLASS + " font-mono"}
              placeholder="const exemplo = () => {};"
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm font-semibold text-rose-300">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={close}>
              Cancelar
            </Button>
            <Button type="submit" icon={Save} loading={isPending}>
              Salvar flashcard
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
