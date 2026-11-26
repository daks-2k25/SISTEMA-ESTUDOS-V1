import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileJson, Upload } from "lucide-react";
import { FlashcardImportForm } from "@/components/features/flashcard-import-form";
import { ImportExample } from "@/components/features/import-example";
import { CardTitle, GlassCard } from "@/components/ui/glass-card";
import { IMPORT_EXAMPLE } from "@/services/flashcard-import";

export const metadata: Metadata = {
  title: "Importar flashcards · DevJr 120",
};

export default function ImportFlashcardsPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="space-y-2">
        <Link href="/flashcards" className="inline-flex items-center gap-1 text-sm font-semibold text-violet-300 hover:text-violet-200">
          <ArrowLeft aria-hidden className="size-4" />
          Voltar para Flashcards
        </Link>
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Importar flashcards</h1>
        <p className="text-sm text-slate-300">
          Cole os cards, confira a prévia e só então clique em Importar. Cards novos entram para revisão imediata.
        </p>
      </header>

      <GlassCard ariaLabel="Importação">
        <CardTitle icon={<Upload aria-hidden className="size-5 text-violet-300" />}>Seus cards</CardTitle>
        <FlashcardImportForm />
      </GlassCard>

      <GlassCard ariaLabel="Formato aceito">
        <CardTitle icon={<FileJson aria-hidden className="size-5 text-violet-300" />}>Formato aceito</CardTitle>
        <ImportExample example={IMPORT_EXAMPLE} />
      </GlassCard>
    </main>
  );
}
