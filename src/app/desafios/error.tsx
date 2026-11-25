"use client";

import { RouteError } from "@/components/features/route-error";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DesafiosError({ reset }: ErrorProps) {
  return <RouteError area="os desafios" reset={reset} />;
}
