import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "aside";
  ariaLabel?: string;
}

export function GlassCard({
  children,
  className,
  as: Tag = "section",
  ariaLabel,
}: GlassCardProps) {
  return (
    <Tag
      aria-label={ariaLabel}
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

interface CardTitleProps {
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}

export function CardTitle({ children, icon, action }: CardTitleProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-lg font-bold text-white">
        {icon}
        {children}
      </h2>
      {action}
    </div>
  );
}
