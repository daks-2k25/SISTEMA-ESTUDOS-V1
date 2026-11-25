import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/cn";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-12 sm:px-6">
      <GlassCard className="w-full text-center">
        <Compass aria-hidden className="mx-auto mb-3 size-12 text-violet-300" />
        <h1 className="text-2xl font-extrabold text-white">Página não encontrada</h1>
        <p className="mt-2 text-slate-300">
          Esse endereço não existe por aqui. Volte para o estudo de hoje e continue de onde parou.
        </p>
        <Link href="/" className={cn(buttonStyles(), "mt-6")}>
          <Home aria-hidden className="size-5" />
          Voltar ao estudo de hoje
        </Link>
      </GlassCard>
    </main>
  );
}
