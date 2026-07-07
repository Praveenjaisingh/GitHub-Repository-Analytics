import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  useRepositoryOverview,
  useRepositoryLanguages,
  useRepositoryContributors,
  useRepositoryCommits,
  useRepositoryIssues,
  useRepositoryPulls,
  useRepositoryReleases,
  useRepositoryHealth,
} from '../hooks/useRepositoryData';
import { Spinner, ErrorState, StatCard } from '../components/Feedback';
import Section from '../components/Section';
import LanguageChart from '../components/LanguageChart';
import CommitActivityChart from '../components/CommitActivityChart';
import ContributorsList from '../components/ContributorsList';
import HealthScoreGauge from '../components/HealthScoreGauge';
import { IssuesPanel, PullsPanel, ReleasesPanel } from '../components/ActivityPanels';
import { useAuth } from '../contexts/AuthContext';
import { RepositoryAPI, BookmarkAPI } from '../services/api';

const numberFmt = (n) => (n ?? 0).toLocaleString();

export default function RepositoryDetail() {
  const { owner, repo } = useParams();
  const { user } = useAuth();
  const [bookmarking, setBookmarking] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const overview = useRepositoryOverview(owner, repo);
  const languages = useRepositoryLanguages(owner, repo);
  const contributors = useRepositoryContributors(owner, repo);
  const commits = useRepositoryCommits(owner, repo);
  const issues = useRepositoryIssues(owner, repo);
  const pulls = useRepositoryPulls(owner, repo);
  const releases = useRepositoryReleases(owner, repo);
  const health = useRepositoryHealth(owner, repo);

  if (overview.isLoading) return <Spinner label={`loading ${owner}/${repo}…`} />;
  if (overview.isError)
    return (
      <ErrorState
        message={overview.error?.response?.data?.errors?.[0] || `Could not load ${owner}/${repo}`}
      />
    );

  const data = overview.data;

  const handleBookmark = async () => {
    if (!user) return;
    setBookmarking(true);
    try {
      await BookmarkAPI.create(owner, repo);
      setBookmarked(true);
    } catch (err) {
      // likely already bookmarked; treat as success from the UI's perspective
      setBookmarked(true);
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <img src={data.avatar} alt={data.owner} className="h-14 w-14 rounded-lg" />
          <div>
            <p className="font-mono text-sm text-mist-500">{data.owner}</p>
            <h1 className="font-display text-2xl font-semibold text-mist-100">{data.name}</h1>
            <p className="mt-1 max-w-xl text-sm text-mist-300">{data.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.topics?.slice(0, 6).map((t) => (
                <span key={t} className="rounded-full bg-ink-800 px-2.5 py-0.5 font-mono text-xs text-mist-300">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {user && (
            <button
              onClick={handleBookmark}
              disabled={bookmarking || bookmarked}
              className="rounded-lg border border-ink-600 px-4 py-2 font-mono text-xs text-mist-300 transition hover:border-amber-500 disabled:opacity-50"
            >
              {bookmarked ? '★ bookmarked' : '☆ bookmark'}
            </button>
          )}
          <a
            href={data.html_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-ink-600 px-4 py-2 font-mono text-xs text-mist-300 transition hover:border-amber-500"
          >
            view on GitHub ↗
          </a>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <StatCard label="Stars" value={numberFmt(data.stars)} accent />
        <StatCard label="Forks" value={numberFmt(data.forks)} />
        <StatCard label="Watchers" value={numberFmt(data.watchers)} />
        <StatCard label="Open Issues" value={numberFmt(data.open_issues)} />
        <StatCard label="License" value={data.license || 'N/A'} />
        <StatCard label="Default Branch" value={data.default_branch} />
      </div>

      {/* Health score */}
      <Section title="Repository Health Score">
        {health.isLoading && <Spinner label="calculating health score…" />}
        {health.data && <HealthScoreGauge health={health.data} />}
      </Section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="Language Distribution">
          {languages.isLoading && <Spinner />}
          {languages.data && <LanguageChart languages={languages.data.languages} />}
        </Section>

        <Section title="Top Contributors">
          {contributors.isLoading && <Spinner />}
          {contributors.data && <ContributorsList contributors={contributors.data} />}
        </Section>
      </div>

      <Section title="Commit Activity (last 26 weeks)">
        {commits.isLoading && <Spinner />}
        {commits.data && <CommitActivityChart commitActivity={commits.data} />}
      </Section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="Issues">
          {issues.isLoading && <Spinner />}
          {issues.data && <IssuesPanel issues={issues.data} />}
        </Section>

        <Section title="Pull Requests">
          {pulls.isLoading && <Spinner />}
          {pulls.data && <PullsPanel pulls={pulls.data} />}
        </Section>
      </div>

      <Section title="Releases">
        {releases.isLoading && <Spinner />}
        {releases.data && <ReleasesPanel releases={releases.data} />}
      </Section>

      <Section title="Export Report">
        <div className="flex flex-wrap gap-3">
          {['pdf', 'csv', 'json'].map((format) => (
            <a
              key={format}
              href={RepositoryAPI.reportUrl(owner, repo, format)}
              className="rounded-lg border border-ink-600 px-4 py-2 font-mono text-xs uppercase text-mist-300 transition hover:border-amber-500 hover:text-amber-400"
            >
              download .{format}
            </a>
          ))}
        </div>
      </Section>

      <Link to="/" className="font-mono text-xs text-mist-500 hover:text-amber-400">
        ← back to search
      </Link>
    </div>
  );
}
