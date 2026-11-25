import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "violet" | "emerald" | "amber" | "slate";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const TONES: Record<BadgeTone, string> = {
  violet: "border-violet-400/30 bg-violet-500/15 text-violet-200",
  emerald: "border-emerald-400/30 bg-emerald-500/15 text-emerald-200",
  amber: "border-amber-400/30 bg-amber-500/15 text-amber-200",
  slate: "border-white/10 bg-white/5 text-slate-300",
};

export function Badge({ children, tone = "slate", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
