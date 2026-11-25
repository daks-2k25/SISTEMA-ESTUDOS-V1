"use client";

import { RouteError } from "@/components/features/route-error";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function FlashcardsError({ reset }: ErrorProps) {
  return <RouteError area="os flashcards" reset={reset} />;
}
