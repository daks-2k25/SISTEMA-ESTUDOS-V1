import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "md" | "lg";

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-linear-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-900/30 hover:from-violet-400 hover:to-indigo-500 active:scale-[0.99]",
  secondary:
    "border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 active:scale-[0.99]",
  danger:
    "border border-rose-400/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 active:scale-[0.99]",
  ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
};

const SIZES: Record<ButtonSize, string> = {
  md: "min-h-11 px-4 py-2 text-sm",
  lg: "min-h-14 px-6 py-3 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "lg",
  fullWidth = false,
}: ButtonStyleOptions = {}): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full");
}
