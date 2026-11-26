"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const CSV_EXAMPLE =
  "courseLesson,dayNumber,question,answer,codeExample\n7,,O que é uma closure?,Função que lembra o escopo onde foi criada.,\n,8,Qual a nota mínima da avaliação?,70.,";

export function ImportExample({ example }: { example: string }) {
  const [copied, setCopied] = useState(false);

  async function copyExample() {
    await navigator.clipboard.writeText(example);
    setCopied(true);
  }

  return (
    <div className="space-y-3 text-sm text-slate-300">
      <p>
        Cada card precisa de <code>question</code>, <code>answer</code> e de <strong>um</strong> destes:{" "}
        <code>courseLesson</code> (número da aula do curso) ou <code>dayNumber</code> (dia da trilha, para dias sem
        aula). <code>codeExample</code> é opcional.
      </p>
      <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d1117] p-4 text-xs text-slate-200">{example}</pre>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="md" icon={Copy} onClick={copyExample}>
          Copiar exemplo
        </Button>
        {copied ? <span role="status" className="font-semibold text-emerald-300">Copiado!</span> : null}
      </div>
      <p>Em CSV, use o cabeçalho abaixo (as colunas que não usar podem ficar vazias):</p>
      <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d1117] p-4 text-xs text-slate-200">{CSV_EXAMPLE}</pre>
    </div>
  );
}
