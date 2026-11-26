"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { PasswordToggle } from "@/components/features/login/password-toggle";
import { useLoginForm } from "@/components/features/login/use-login-form";
import { cn } from "@/lib/cn";

const INPUT_CLASS =
  "h-12 w-full border-2 border-black bg-white px-3 font-mono text-black outline-none transition focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[4px_4px_0_0_#000]";

const LABEL_CLASS = "font-mono text-[11px] font-bold tracking-[0.25em] text-black uppercase";

function FusionBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#ffb36b]">
      <div className="absolute inset-x-0 top-0 h-[22%] bg-[#ff7a59]" />
      <div className="absolute inset-x-0 top-[22%] h-[18%] bg-[#ff9466]" />
      <p className="absolute inset-x-0 top-[4%] text-center text-[38vw] leading-none font-black tracking-tighter text-transparent select-none [-webkit-text-stroke:3px_rgba(0,0,0,0.18)]">
        120
      </p>
      <div className="absolute bottom-[24%] left-1/2 size-64 -translate-x-1/2 rounded-full border-4 border-black bg-[#fde047]" />
      <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="absolute bottom-0 h-[42%] w-full">
        <path d="M0 250 L200 120 L380 220 L560 80 L760 210 L940 110 L1120 230 L1300 100 L1440 190 L1440 400 L0 400 Z" fill="#a78bfa" stroke="#000" strokeWidth="4" />
        <path d="M0 320 L240 200 L460 300 L680 180 L900 290 L1120 200 L1340 290 L1440 250 L1440 400 L0 400 Z" fill="#7c3aed" stroke="#000" strokeWidth="4" />
        <path d="M0 370 L280 300 L560 360 L820 290 L1080 360 L1320 310 L1440 340 L1440 400 L0 400 Z" fill="#1f1147" stroke="#000" strokeWidth="4" />
      </svg>
    </div>
  );
}

function RememberMeCheckbox() {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <span className="relative flex size-6 shrink-0">
        <input
          type="checkbox"
          name="rememberMe"
          className="peer size-6 cursor-pointer appearance-none border-2 border-black bg-white transition checked:bg-[#ff5a1f] focus-visible:shadow-[3px_3px_0_0_#000]"
        />
        <Check
          aria-hidden
          strokeWidth={4}
          className="pointer-events-none absolute inset-0 m-auto size-4 text-black opacity-0 peer-checked:opacity-100"
        />
      </span>
      <span className={LABEL_CLASS}>Lembrar de mim</span>
    </label>
  );
}

export function FusionLogin() {
  const { error, isPending, handleSubmit } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative flex min-h-full items-center justify-center p-6">
      <FusionBackground />

      <section className="relative w-full max-w-sm border-4 border-black bg-white shadow-[10px_10px_0_0_#000]">
        <span className="absolute -top-5 -right-5 rotate-6 border-2 border-black bg-[#ff5a1f] px-3 py-1 text-sm font-black text-black shadow-[3px_3px_0_0_#000]">
          120 DIAS
        </span>

        <div className="p-6 sm:p-8">
          <p className={LABEL_CLASS}>
            <span className="text-[#ff5a1f]">●</span> DevJr 120 — Acesso
          </p>
          <h1 className="mt-3 text-4xl leading-[0.95] font-black tracking-tight text-black">
            A subida
            <br />
            continua<span className="text-[#ff5a1f]">.</span>
          </h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label htmlFor="fusao-usuario" className={LABEL_CLASS}>01 · Usuário</label>
              <input id="fusao-usuario" name="username" autoComplete="username" required maxLength={100} autoFocus className={INPUT_CLASS} />
            </div>

            <div className="space-y-2">
              <label htmlFor="fusao-senha" className={LABEL_CLASS}>02 · Senha</label>
              <div className="relative">
                <input
                  id="fusao-senha"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  maxLength={200}
                  className={cn(INPUT_CLASS, "pr-12")}
                />
                <PasswordToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center border-l-2 border-black text-black hover:bg-[#fde047]"
                />
              </div>
            </div>

            <RememberMeCheckbox />

            {error ? (
              <p role="alert" className="border-2 border-black bg-[#fca5a5] px-3 py-2 text-sm font-bold text-black">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="flex h-14 w-full items-center justify-center gap-2 border-2 border-black bg-[#ff5a1f] text-lg font-black text-black uppercase shadow-[5px_5px_0_0_#000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-60"
            >
              {isPending ? <Loader2 aria-hidden className="size-5 animate-spin" /> : null}
              {isPending ? "Entrando..." : "Entrar"}
              {isPending ? null : <ArrowRight aria-hidden className="size-5" strokeWidth={3} />}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
