export default function ContributorsList({ contributors }) {
  if (!contributors || contributors.length === 0) {
    return <p className="py-8 text-center font-mono text-sm text-mist-500">No contributors found.</p>;
  }

  const max = contributors[0]?.contributions || 1;

  return (
    <ul className="space-y-3">
      {contributors.slice(0, 10).map((c, i) => (
        <li key={c.login} className="flex items-center gap-3">
          <span className="w-5 font-mono text-xs text-mist-500">{i + 1}</span>
          <img src={c.avatar} alt={c.login} className="h-8 w-8 rounded-full" />
          <a
            href={c.html_url}
            target="_blank"
            rel="noreferrer"
            className="w-28 shrink-0 truncate text-sm text-mist-100 hover:text-amber-400"
          >
            {c.login}
          </a>
          <div className="h-1.5 flex-1 rounded-full bg-ink-700">
            <div
              className="h-1.5 rounded-full bg-amber-500"
              style={{ width: `${(c.contributions / max) * 100}%` }}
            />
          </div>
          <span className="w-14 shrink-0 text-right font-mono text-xs text-mist-500">
            {c.contributions}
          </span>
        </li>
      ))}
    </ul>
  );
}
