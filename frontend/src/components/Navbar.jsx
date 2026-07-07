import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, login, logout, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-ink-700 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500 font-mono text-sm font-bold text-ink-950">
            {'</>'}
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-mist-100">
            Repo<span className="text-amber-400">/</span>Graph
          </span>
        </Link>

        <nav className="flex items-center gap-6 font-sans text-sm">
          <Link to="/" className="text-mist-300 transition hover:text-mist-100">
            Search
          </Link>
          {user && (
            <Link to="/bookmarks" className="text-mist-300 transition hover:text-mist-100">
              Bookmarks
            </Link>
          )}

          {!loading &&
            (user ? (
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-2 rounded-full border border-ink-600 px-3 py-1.5 text-mist-100 transition hover:border-amber-500"
              >
                <img src={user.avatar} alt={user.name} className="h-5 w-5 rounded-full" />
                <span>{user.name}</span>
              </button>
            ) : (
              <button
                onClick={login}
                className="rounded-full bg-amber-500 px-4 py-1.5 font-medium text-ink-950 transition hover:bg-amber-400"
              >
                Sign in with GitHub
              </button>
            ))}
        </nav>
      </div>
    </header>
  );
}
