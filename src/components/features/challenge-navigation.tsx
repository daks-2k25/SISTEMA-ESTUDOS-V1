import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";
import type { ChallengeListItem } from "@/use-cases/get-challenges-overview";

interface ChallengeNavigationProps {
  items: ChallengeListItem[];
  selectedId: string;
  previousId: string | null;
  nextId: string | null;
}

function hrefFor(id: string): string {
  return "/desafios?desafio=" + encodeURIComponent(id);
}

export function ChallengeNavigation({
  items,
  selectedId,
  previousId,
  nextId,
}: ChallengeNavigationProps) {
  const disabledStyle = cn(
    buttonStyles({ variant: "secondary", size: "md" }),
    "pointer-events-none opacity-40",
  );

  return (
    <div className="space-y-4">
      <nav aria-label="Navegação entre desafios" className="flex gap-3">
        {previousId ? (
          <Link href={hrefFor(previousId)} className={buttonStyles({ variant: "secondary", size: "md" })}>
            <ChevronLeft aria-hidden className="size-5" />
            Anterior
          </Link>
        ) : (
          <span aria-disabled className={disabledStyle}>
            <ChevronLeft aria-hidden className="size-5" />
            Anterior
          </span>
        )}
        {nextId ? (
          <Link href={hrefFor(nextId)} className={buttonStyles({ variant: "secondary", size: "md" })}>
            Próximo
            <ChevronRight aria-hidden className="size-5" />
          </Link>
        ) : (
          <span aria-disabled className={disabledStyle}>
            Próximo
            <ChevronRight aria-hidden className="size-5" />
          </span>
        )}
      </nav>

      <ul aria-label="Desafios disponíveis" className="flex max-h-60 flex-col gap-1 overflow-y-auto">
        {items.map((item) => {
          const isCurrent = item.id === selectedId;
          return (
            <li key={item.id}>
              <Link
                href={hrefFor(item.id)}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm transition",
                  isCurrent
                    ? "bg-violet-500/20 font-semibold text-white"
                    : "text-slate-300 hover:bg-white/5",
                )}
              >
                {item.isCompleted ? (
                  <CheckCircle2 aria-label="Concluído" className="size-4 shrink-0 text-emerald-400" />
                ) : (
                  <Circle aria-label="Pendente" className="size-4 shrink-0 text-slate-500" />
                )}
                <span className="shrink-0 font-mono text-xs text-slate-400">
                  Dia {item.dayNumber}
                </span>
                <span className="truncate">{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
