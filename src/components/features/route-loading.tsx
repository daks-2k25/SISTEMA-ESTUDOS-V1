interface RouteLoadingProps {
  area: string;
}

export function RouteLoading({ area }: RouteLoadingProps) {
  return (
    <main
      aria-busy
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6"
    >
      <p role="status" className="sr-only">
        Carregando {area}...
      </p>
      <div aria-hidden className="h-32 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
      <div aria-hidden className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/5 lg:col-span-2" />
        <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
      </div>
    </main>
  );
}
