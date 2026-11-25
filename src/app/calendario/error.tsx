"use client";

import { RouteError } from "@/components/features/route-error";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CalendarioError({ reset }: ErrorProps) {
  return <RouteError area="o calendário" reset={reset} />;
}
