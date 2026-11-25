import type { ButtonHTMLAttributes } from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  buttonStyles,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button-styles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: LucideIcon;
  loading?: boolean;
}

export function Button({
  variant,
  size,
  fullWidth,
  icon: Icon,
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(buttonStyles({ variant, size, fullWidth }), className)}
      {...rest}
    >
      {loading ? (
        <Loader2 aria-hidden className="size-5 animate-spin" />
      ) : Icon ? (
        <Icon aria-hidden className="size-5" />
      ) : null}
      {children}
    </button>
  );
}
