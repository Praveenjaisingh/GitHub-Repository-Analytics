import Navbar from '../components/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-ink-950 bg-grid-lines bg-grid">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      <footer className="mx-auto max-w-6xl px-6 pb-10 pt-4 font-mono text-xs text-mist-500">
        Built with the GitHub REST API · not affiliated with GitHub
      </footer>
    </div>
  );
}
