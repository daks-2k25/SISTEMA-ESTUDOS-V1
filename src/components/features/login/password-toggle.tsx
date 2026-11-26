"use client";

import { Eye, EyeOff } from "lucide-react";

interface PasswordToggleProps {
  visible: boolean;
  onToggle: () => void;
  className: string;
}

export function PasswordToggle({ visible, onToggle, className }: PasswordToggleProps) {
  const Icon = visible ? EyeOff : Eye;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
      aria-pressed={visible}
      className={className}
    >
      <Icon aria-hidden className="size-4" />
    </button>
  );
}
