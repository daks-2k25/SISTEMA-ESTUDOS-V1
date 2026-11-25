import { Suspense } from "react";
import {
  ChallengesSection,
  type ChallengesSearchParams,
} from "@/components/features/challenges-section";

interface ChallengesPageProps {
  searchParams: ChallengesSearchParams;
}

export default function ChallengesPage({ searchParams }: ChallengesPageProps) {
  return (
    <Suspense
      fallback={
        <p className="px-6 py-10 text-center text-slate-400">Carregando desafios...</p>
      }
    >
      <ChallengesSection searchParams={searchParams} />
    </Suspense>
  );
}
