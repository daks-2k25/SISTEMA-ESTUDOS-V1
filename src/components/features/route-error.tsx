"use client";

import { AlertOctagon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

interface RouteErrorProps {
  area: string;
  reset: () => void;
}

export function RouteError({ area, reset }: RouteErrorProps) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-12 sm:px-6">
      <GlassCard className="w-full text-center">
        <AlertOctagon aria-hidden className="mx-auto mb-3 size-12 text-rose-300" />
        <h1 className="text-2xl font-extrabold text-white">Algo deu errado</h1>
        <p role="alert" className="mt-2 text-slate-300">
          Não foi possível carregar {area}. Seus dados estão seguros; tente novamente.
        </p>
        <Button className="mt-6" icon={RotateCcw} onClick={reset}>
          Tentar novamente
        </Button>
      </GlassCard>
    </main>
  );
}
