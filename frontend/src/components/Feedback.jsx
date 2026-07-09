export function StatCard({ label, value, accent = false }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900 p-3 transition hover:border-ink-600 sm:p-4">
      <p className="truncate font-mono text-[10px] uppercase tracking-wide text-mist-500 sm:text-xs">{label}</p>
      <p
        className={`mt-1 truncate font-display text-xl font-semibold sm:text-2xl ${
          accent ? 'text-amber-400' : 'text-mist-100'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-mist-500">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-600 border-t-amber-500" />
      <p className="font-mono text-xs">{label}</p>
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="rounded-xl border border-rose/30 bg-rose/5 p-6 text-center">
      <p className="font-mono text-sm text-rose">{message || 'Something went wrong.'}</p>
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-ink-600 bg-ink-900/50 p-10 text-center">
      <p className="font-display text-lg text-mist-100">{title}</p>
      {description && <p className="mt-1 text-sm text-mist-500">{description}</p>}
    </div>
  );
}
