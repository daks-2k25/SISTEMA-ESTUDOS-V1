import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number;
  label: string;
  className?: string;
}

export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-white/10", className)}
    >
      <div
        className="h-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500 transition-[width] duration-500"
        style={{ width: safeValue + "%" }}
      />
    </div>
  );
}
