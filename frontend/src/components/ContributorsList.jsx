export default function ContributorsList({ contributors }) {
  if (!contributors || contributors.length === 0) {
    return <p className="py-8 text-center font-mono text-sm text-mist-500">No contributors found.</p>;
  }

  const max = contributors[0]?.contributions || 1;

  return (
    <ul className="space-y-3">
      {contributors.slice(0, 10).map((c, i) => (
        <li key={c.login} className="flex items-center gap-2 sm:gap-3">
          <span className="w-4 shrink-0 font-mono text-xs text-mist-500 sm:w-5">{i + 1}</span>
          <img src={c.avatar} alt={c.login} className="h-7 w-7 shrink-0 rounded-full sm:h-8 sm:w-8" />
          <a
            href={c.html_url}
            target="_blank"
            rel="noreferrer"
            className="w-16 shrink-0 truncate text-sm text-mist-100 hover:text-amber-400 xs:w-24 sm:w-28"
          >
            {c.login}
          </a>
          <div className="h-1.5 flex-1 rounded-full bg-ink-700">
            <div
              className="h-1.5 rounded-full bg-amber-500"
              style={{ width: `${(c.contributions / max) * 100}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right font-mono text-xs text-mist-500 sm:w-14">
            {c.contributions}
          </span>
        </li>
      ))}
    </ul>
  );
}
