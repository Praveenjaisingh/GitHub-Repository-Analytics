import { useState } from 'react';

export default function SearchBar({ initialValue = '', onSearch, large = false }) {
  const [value, setValue] = useState(initialValue);

  const submit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-3 xs:flex-row xs:items-center">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-amber-500 sm:left-4">
          ~/
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="search owner/repo or a keyword — e.g. facebook/react"
          className={`w-full rounded-lg border border-ink-600 bg-ink-900 pl-9 pr-4 font-mono text-mist-100 placeholder:truncate placeholder:text-mist-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:pl-10 ${
            large ? 'py-3.5 text-sm sm:py-4 sm:text-base' : 'py-2.5 text-sm'
          }`}
        />
      </div>
      <button
        type="submit"
        className={`shrink-0 rounded-lg bg-amber-500 font-medium text-ink-950 transition hover:bg-amber-400 active:scale-[0.98] ${
          large ? 'px-6 py-3.5 sm:py-4' : 'px-4 py-2.5 text-sm'
        }`}
      >
        Analyze
      </button>
    </form>
  );
}
