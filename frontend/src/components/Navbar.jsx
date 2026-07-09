import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  );
}

export default function Navbar() {
  const { user, login, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-ink-700 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" onClick={closeMenu} className="group flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500 font-mono text-sm font-bold text-ink-950">
            {'</>'}
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-mist-100 sm:text-lg">
            Repo<span className="text-amber-400">/</span>Graph
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 font-sans text-sm md:flex">
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
                <span className="max-w-[8rem] truncate">{user.name}</span>
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

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-600 text-mist-100 transition hover:border-amber-500 md:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`overflow-hidden border-t border-ink-700 bg-ink-950/95 backdrop-blur transition-[max-height] duration-300 ease-in-out md:hidden ${
          open ? 'max-h-64' : 'max-h-0 border-t-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-4 font-sans text-sm">
          <Link
            to="/"
            onClick={closeMenu}
            className="rounded-lg px-3 py-2.5 text-mist-300 transition hover:bg-ink-800 hover:text-mist-100"
          >
            Search
          </Link>
          {user && (
            <Link
              to="/bookmarks"
              onClick={closeMenu}
              className="rounded-lg px-3 py-2.5 text-mist-300 transition hover:bg-ink-800 hover:text-mist-100"
            >
              Bookmarks
            </Link>
          )}

          {!loading &&
            (user ? (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                  navigate('/');
                }}
                className="mt-2 flex items-center gap-2 rounded-lg border border-ink-600 px-3 py-2.5 text-mist-100 transition hover:border-amber-500"
              >
                <img src={user.avatar} alt={user.name} className="h-5 w-5 rounded-full" />
                <span className="truncate">{user.name}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  login();
                  closeMenu();
                }}
                className="mt-2 rounded-lg bg-amber-500 px-4 py-2.5 text-center font-medium text-ink-950 transition hover:bg-amber-400"
              >
                Sign in with GitHub
              </button>
            ))}
        </nav>
      </div>
    </header>
  );
}
