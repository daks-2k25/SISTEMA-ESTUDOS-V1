"use client";

import { useState } from "react";
import { ChevronDown, Eye, Lightbulb, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type SolutionStep = "hidden" | "confirming" | "revealed";

interface ChallengeHelpProps {
  hint: string;
  solutionCode: string;
}

export function ChallengeHelp({ hint, solutionCode }: ChallengeHelpProps) {
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionStep, setSolutionStep] = useState<SolutionStep>("hidden");

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-white/10 bg-white/5">
        <button
          type="button"
          aria-expanded={hintOpen}
          aria-controls="dica-do-desafio"
          onClick={() => setHintOpen((open) => !open)}
          className="flex min-h-12 w-full items-center justify-between gap-2 rounded-2xl px-4 text-left font-semibold text-amber-100"
        >
          <span className="flex items-center gap-2">
            <Lightbulb aria-hidden className="size-5 text-amber-300" />
            Ver Dica
          </span>
          <ChevronDown
            aria-hidden
            className={cn("size-5 transition-transform", hintOpen && "rotate-180")}
          />
        </button>
        {hintOpen ? (
          <p id="dica-do-desafio" className="px-4 pb-4 text-slate-200">
            {hint}
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5">
        <button
          type="button"
          aria-expanded={solutionStep !== "hidden"}
          aria-controls="solucao-do-desafio"
          onClick={() =>
            setSolutionStep((step) => (step === "hidden" ? "confirming" : "hidden"))
          }
          className="flex min-h-12 w-full items-center justify-between gap-2 rounded-2xl px-4 text-left font-semibold text-slate-100"
        >
          <span className="flex items-center gap-2">
            <Eye aria-hidden className="size-5 text-violet-300" />
            Ver Solução Esperada
          </span>
          <ChevronDown
            aria-hidden
            className={cn(
              "size-5 transition-transform",
              solutionStep !== "hidden" && "rotate-180",
            )}
          />
        </button>

        <div id="solucao-do-desafio">
          {solutionStep === "confirming" ? (
            <div className="space-y-3 px-4 pb-4">
              <p className="flex items-start gap-2 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-100">
                <ShieldAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
                <span>
                  <strong>Tente primeiro!</strong> Você aprende mais quando tenta resolver sozinho.
                  Use a dica antes de olhar a solução.
                </span>
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" size="md" onClick={() => setSolutionStep("hidden")}>
                  Continuar tentando
                </Button>
                <Button size="md" onClick={() => setSolutionStep("revealed")}>
                  Revelar solução
                </Button>
              </div>
            </div>
          ) : null}

          {solutionStep === "revealed" ? (
            <pre
              tabIndex={0}
              role="region"
              aria-label="Solução esperada"
              className="mx-4 mb-4 overflow-x-auto rounded-2xl border border-white/10 bg-[#0d1117] p-4 text-sm text-slate-100"
            >
              <code>{solutionCode}</code>
            </pre>
          ) : null}
        </div>
      </div>
    </div>
  );
}
