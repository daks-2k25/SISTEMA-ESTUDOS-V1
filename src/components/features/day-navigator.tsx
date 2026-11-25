import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";

interface DayNavigatorProps {
  previousDayNumber: number | null;
  nextDayNumber: number | null;
  moduleTitle: string | null;
}

function buildHref(dayNumber: number, moduleTitle: string | null): string {
  const params = new URLSearchParams({ dia: String(dayNumber) });
  if (moduleTitle) params.set("modulo", moduleTitle);
  return "/?" + params.toString();
}

export function DayNavigator({
  previousDayNumber,
  nextDayNumber,
  moduleTitle,
}: DayNavigatorProps) {
  const disabledStyle = cn(
    buttonStyles({ variant: "secondary", size: "md" }),
    "pointer-events-none opacity-40",
  );

  return (
    <nav aria-label="Navegação entre dias" className="flex gap-3">
      {previousDayNumber !== null ? (
        <Link
          href={buildHref(previousDayNumber, moduleTitle)}
          className={buttonStyles({ variant: "secondary", size: "md" })}
        >
          <ChevronLeft aria-hidden className="size-5" />
          Dia anterior
        </Link>
      ) : (
        <span aria-disabled className={disabledStyle}>
          <ChevronLeft aria-hidden className="size-5" />
          Dia anterior
        </span>
      )}
      {nextDayNumber !== null ? (
        <Link
          href={buildHref(nextDayNumber, moduleTitle)}
          className={buttonStyles({ variant: "secondary", size: "md" })}
        >
          Próximo dia
          <ChevronRight aria-hidden className="size-5" />
        </Link>
      ) : (
        <span aria-disabled className={disabledStyle}>
          Próximo dia
          <ChevronRight aria-hidden className="size-5" />
        </span>
      )}
    </nav>
  );
}
