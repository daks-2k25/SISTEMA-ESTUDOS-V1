"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen items-center justify-center bg-[#0B0F19] p-6 text-slate-100">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-2xl font-extrabold">O DevJr 120 encontrou um problema</h1>
          <p role="alert" className="mt-2 text-slate-300">
            Não foi possível carregar a aplicação. Tente novamente em instantes.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 min-h-12 rounded-2xl bg-linear-to-r from-violet-500 to-indigo-600 px-6 font-semibold text-white"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
