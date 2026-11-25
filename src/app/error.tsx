"use client";

import { RouteError } from "@/components/features/route-error";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HomeError({ reset }: ErrorProps) {
  return <RouteError area="o dia de estudo" reset={reset} />;
}
