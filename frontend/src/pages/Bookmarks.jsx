import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBookmarks } from '../hooks/useRepositoryData';
import { BookmarkAPI } from '../services/api';
import { Spinner, ErrorState, EmptyState } from '../components/Feedback';

export default function Bookmarks() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useBookmarks(!!user);

  const remove = async (id) => {
    await BookmarkAPI.remove(id);
    queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
  };

  if (loading) return <Spinner />;

  if (!user) {
    return (
      <EmptyState
        title="Sign in to view bookmarks"
        description="Use the “Sign in with GitHub” button in the top right."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-mist-100">Your Bookmarks</h1>

      {isLoading && <Spinner />}
      {isError && <ErrorState message="Could not load bookmarks." />}
      {data && data.length === 0 && (
        <EmptyState title="No bookmarks yet" description="Bookmark a repository from its detail page." />
      )}

      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3">
        {data?.map((b) => (
          <div
            key={b.id}
            className="flex flex-col gap-3 rounded-xl border border-ink-700 bg-ink-900 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-amber-500/40 sm:p-5"
          >
            <div className="flex items-center gap-3">
              <img src={b.Repository?.avatar} alt="" className="h-9 w-9 rounded-md" />
              <div className="min-w-0">
                <p className="truncate font-mono text-xs text-mist-500">{b.Repository?.owner}</p>
                <p className="truncate font-display text-base font-semibold text-mist-100">
                  {b.Repository?.repository_name}
                </p>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-between">
              <Link
                to={`/repo/${b.Repository?.owner}/${b.Repository?.repository_name}`}
                className="font-mono text-xs text-amber-400 hover:underline"
              >
                view analytics →
              </Link>
              <button
                onClick={() => remove(b.id)}
                className="font-mono text-xs text-mist-500 hover:text-rose"
              >
                remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
