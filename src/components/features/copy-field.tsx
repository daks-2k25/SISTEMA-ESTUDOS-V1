"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyFieldProps {
  value: string;
  label: string;
}

export function CopyField({ value, label }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        readOnly
        value={value}
        aria-label={label}
        onFocus={(event) => event.currentTarget.select()}
        className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#111827] px-4 py-2.5 font-mono text-xs text-white"
      />
      <Button variant="secondary" size="md" icon={Copy} onClick={copy}>
        {copied ? "Copiado!" : "Copiar"}
      </Button>
    </div>
  );
}
