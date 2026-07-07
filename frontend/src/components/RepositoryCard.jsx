import { Link } from 'react-router-dom';

const numberFmt = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
};

export default function RepositoryCard({ repo }) {
  return (
    <Link
      to={`/repo/${repo.owner}/${repo.name}`}
      className="group flex flex-col gap-3 rounded-xl border border-ink-700 bg-ink-900 p-5 transition hover:border-amber-500/60 hover:bg-ink-800"
    >
      <div className="flex items-center gap-3">
        <img src={repo.avatar} alt={repo.owner} className="h-9 w-9 rounded-md" />
        <div className="min-w-0">
          <p className="truncate font-mono text-sm text-mist-300">{repo.owner}</p>
          <p className="truncate font-display text-lg font-semibold text-mist-100 group-hover:text-amber-400">
            {repo.name}
          </p>
        </div>
      </div>

      <p className="line-clamp-2 text-sm text-mist-300">{repo.description || 'No description provided.'}</p>

      <div className="mt-auto flex items-center gap-4 pt-2 font-mono text-xs text-mist-500">
        <span>★ {numberFmt(repo.stars)}</span>
        <span>⑂ {numberFmt(repo.forks)}</span>
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {repo.language}
          </span>
        )}
      </div>
    </Link>
  );
}
