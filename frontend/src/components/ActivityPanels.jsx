import { StatCard } from './Feedback';

export function IssuesPanel({ issues }) {
  if (!issues) return null;
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <StatCard label="Total" value={issues.total} />
        <StatCard label="Open" value={issues.open} accent />
        <StatCard label="Closed" value={issues.closed} />
      </div>
      {issues.labels?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {issues.labels.slice(0, 8).map((l) => (
            <span
              key={l.name}
              className="rounded-full border border-ink-600 px-2.5 py-1 font-mono text-xs text-mist-300"
            >
              {l.name} · {l.count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function PullsPanel({ pulls }) {
  if (!pulls) return null;
  return (
    <div className="grid grid-cols-2 gap-2 xs:grid-cols-4 sm:gap-3">
      <StatCard label="Total" value={pulls.total} />
      <StatCard label="Open" value={pulls.open} accent />
      <StatCard label="Merged" value={pulls.merged} />
      <StatCard label="Closed" value={pulls.closed} />
    </div>
  );
}

export function ReleasesPanel({ releases }) {
  if (!releases) return null;
  if (releases.total === 0) {
    return <p className="py-6 text-center font-mono text-sm text-mist-500">No releases published yet.</p>;
  }
  return (
    <ul className="space-y-3">
      {releases.history.slice(0, 6).map((r) => (
        <li
          key={r.tag_name}
          className="flex flex-col gap-1 rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0"
        >
          <div className="min-w-0">
            <a href={r.html_url} target="_blank" rel="noreferrer" className="font-mono text-sm text-amber-400">
              {r.tag_name}
            </a>
            <p className="truncate text-xs text-mist-500">{r.name || 'Untitled release'}</p>
          </div>
          <span className="shrink-0 font-mono text-xs text-mist-500">
            {r.published_at ? new Date(r.published_at).toLocaleDateString() : 'unpublished'}
          </span>
        </li>
      ))}
    </ul>
  );
}
