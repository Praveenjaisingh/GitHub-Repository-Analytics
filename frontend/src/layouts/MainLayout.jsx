import Navbar from '../components/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-ink-950 bg-grid-lines bg-grid">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-4 text-center font-mono text-xs text-mist-500 sm:px-6 sm:text-left">
        Built with the GitHub REST API · not affiliated with GitHub
      </footer>
    </div>
  );
}
