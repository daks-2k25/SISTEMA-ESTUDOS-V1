interface TimerProps {
  clock: string;
  caption: string;
}

export function Timer({ clock, caption }: TimerProps) {
  return (
    <div role="timer" aria-label={caption} className="text-center">
      <p className="font-mono text-6xl font-bold tracking-tight text-white tabular-nums sm:text-7xl">
        {clock}
      </p>
      <p className="mt-1 text-sm text-slate-300">{caption}</p>
    </div>
  );
}
