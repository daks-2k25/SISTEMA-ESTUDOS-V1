import { Suspense } from "react";
import { FlashcardsSection } from "@/components/features/flashcards-section";

export default function FlashcardsPage() {
  return (
    <Suspense
      fallback={
        <p className="px-6 py-10 text-center text-slate-400">Carregando flashcards...</p>
      }
    >
      <FlashcardsSection />
    </Suspense>
  );
}
