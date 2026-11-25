interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      {message ? (
        <p className="rounded-2xl border border-emerald-400/30 bg-emerald-500/90 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-black/40">
          {message}
        </p>
      ) : null}
    </div>
  );
}
