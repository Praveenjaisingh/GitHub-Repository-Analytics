export default function Section({ title, action, children }) {
  return (
    <section className="rounded-xl border border-ink-700 bg-ink-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-mist-100">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
