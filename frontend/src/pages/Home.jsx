import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import RepositoryCard from '../components/RepositoryCard';
import { Spinner, ErrorState, EmptyState } from '../components/Feedback';
import { useSearchRepositories } from '../hooks/useRepositoryData';

export default function Home() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useSearchRepositories(q, page);

  const onSearch = (value) => {
    setPage(1);
    setParams({ q: value });
  };

  // Direct owner/repo shortcut, e.g. "facebook/react"
  const goDirect = (value) => {
    if (/^[\w.-]+\/[\w.-]+$/.test(value.trim())) {
      const [owner, repo] = value.trim().split('/');
      navigate(`/repo/${owner}/${repo}`);
      return true;
    }
    return false;
  };

  const handleSearch = (value) => {
    if (goDirect(value)) return;
    onSearch(value);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-6 pb-4 pt-10 text-center">
        <span className="rounded-full border border-ink-600 px-3 py-1 font-mono text-xs text-mist-500">
          v1.0 · powered by the GitHub REST API
        </span>
        <h1 className="font-display text-4xl font-semibold text-mist-100 sm:text-5xl">
          Understand any repo <span className="text-amber-400">at a glance.</span>
        </h1>
        <p className="max-w-xl text-mist-300">
          Search a keyword or paste an <code className="font-mono text-amber-400">owner/repo</code> to pull
          contributors, commit activity, languages, issues, and a computed health score.
        </p>
        <div className="w-full max-w-2xl">
          <SearchBar initialValue={q} onSearch={handleSearch} large />
        </div>
      </div>

      {q && (
        <div>
          {isLoading && <Spinner label={`searching for "${q}"…`} />}
          {isError && <ErrorState message={error?.response?.data?.errors?.[0] || error.message} />}
          {data && data.items.length === 0 && (
            <EmptyState title="No repositories found" description="Try a different keyword." />
          )}
          {data && data.items.length > 0 && (
            <>
              <p className="mb-4 font-mono text-xs text-mist-500">
                {data.total_count.toLocaleString()} results
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((repo) => (
                  <RepositoryCard key={repo.id} repo={repo} />
                ))}
              </div>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-ink-600 px-4 py-2 font-mono text-xs text-mist-300 disabled:opacity-30"
                >
                  ← prev
                </button>
                <span className="px-2 py-2 font-mono text-xs text-mist-500">page {page}</span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-ink-600 px-4 py-2 font-mono text-xs text-mist-300"
                >
                  next →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
