const github = require('./githubService');
const { calculateHealthScore } = require('./healthScoreService');
const { Repository, AnalyticsSnapshot } = require('../models');
const AppError = require('../utils/appError');

const parseOwnerRepo = (owner, repo) => {
  if (!owner || !repo) throw new AppError('owner and repo are required', 400);
  return { owner, repo };
};

exports.search = async (query, token, page, perPage) => {
  if (!query) throw new AppError('Query parameter "q" is required', 400);
  const data = await github.searchRepositories(query, token, page, perPage);
  return {
    total_count: data.total_count,
    items: data.items.map((r) => ({
      id: r.id,
      full_name: r.full_name,
      owner: r.owner.login,
      name: r.name,
      description: r.description,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      avatar: r.owner.avatar_url,
      html_url: r.html_url,
      updated_at: r.updated_at,
    })),
  };
};

exports.getOverview = async (owner, repo, token) => {
  parseOwnerRepo(owner, repo);
  const r = await github.getRepository(owner, repo, token);
  return {
    id: r.id,
    full_name: r.full_name,
    owner: r.owner.login,
    name: r.name,
    description: r.description,
    stars: r.stargazers_count,
    forks: r.forks_count,
    watchers: r.subscribers_count ?? r.watchers_count,
    open_issues: r.open_issues_count,
    license: r.license ? r.license.spdx_id : null,
    default_branch: r.default_branch,
    created_at: r.created_at,
    updated_at: r.updated_at,
    pushed_at: r.pushed_at,
    avatar: r.owner.avatar_url,
    html_url: r.html_url,
    homepage: r.homepage,
    topics: r.topics || [],
    is_private: r.private,
  };
};

exports.getLanguages = async (owner, repo, token) => {
  parseOwnerRepo(owner, repo);
  const languages = await github.getLanguages(owner, repo, token);
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const breakdown = Object.entries(languages).map(([name, bytes]) => ({
    name,
    bytes,
    percentage: totalBytes ? Number(((bytes / totalBytes) * 100).toFixed(2)) : 0,
  }));
  return { total_bytes: totalBytes, languages: breakdown };
};

exports.getContributors = async (owner, repo, token) => {
  parseOwnerRepo(owner, repo);
  const contributors = await github.getContributors(owner, repo, token);
  return contributors
    .map((c) => ({
      login: c.login,
      avatar: c.avatar_url,
      contributions: c.contributions,
      html_url: c.html_url,
    }))
    .sort((a, b) => b.contributions - a.contributions);
};

exports.getCommitActivity = async (owner, repo, token) => {
  parseOwnerRepo(owner, repo);
  const weeks = await github.getCommitActivity(owner, repo, token);
  if (!Array.isArray(weeks)) {
    // GitHub returns 202 with empty body while it computes stats async
    return { status: 'computing', weeks: [] };
  }
  return {
    status: 'ready',
    weeks: weeks.map((w) => ({
      week_start: new Date(w.week * 1000).toISOString().split('T')[0],
      total: w.total,
      days: w.days,
    })),
  };
};

exports.getIssues = async (owner, repo, token) => {
  parseOwnerRepo(owner, repo);
  const raw = await github.getIssues(owner, repo, token, 'all', 100);
  const issuesOnly = raw.filter((i) => !i.pull_request);
  const open = issuesOnly.filter((i) => i.state === 'open');
  const closed = issuesOnly.filter((i) => i.state === 'closed');

  const labelCounts = {};
  issuesOnly.forEach((i) => {
    (i.labels || []).forEach((l) => {
      const name = typeof l === 'string' ? l : l.name;
      labelCounts[name] = (labelCounts[name] || 0) + 1;
    });
  });

  return {
    total: issuesOnly.length,
    open: open.length,
    closed: closed.length,
    labels: Object.entries(labelCounts).map(([name, count]) => ({ name, count })),
    recent: issuesOnly.slice(0, 10).map((i) => ({
      number: i.number,
      title: i.title,
      state: i.state,
      created_at: i.created_at,
      html_url: i.html_url,
    })),
  };
};

exports.getPullRequests = async (owner, repo, token) => {
  parseOwnerRepo(owner, repo);
  const raw = await github.getPullRequests(owner, repo, token, 'all', 100);
  const open = raw.filter((p) => p.state === 'open');
  const merged = raw.filter((p) => p.merged_at);
  const closed = raw.filter((p) => p.state === 'closed' && !p.merged_at);

  return {
    total: raw.length,
    open: open.length,
    merged: merged.length,
    closed: closed.length,
    recent: raw.slice(0, 10).map((p) => ({
      number: p.number,
      title: p.title,
      state: p.merged_at ? 'merged' : p.state,
      created_at: p.created_at,
      html_url: p.html_url,
    })),
  };
};

exports.getReleases = async (owner, repo, token) => {
  parseOwnerRepo(owner, repo);
  const releases = await github.getReleases(owner, repo, token);
  return {
    total: releases.length,
    latest: releases[0]
      ? {
          tag_name: releases[0].tag_name,
          name: releases[0].name,
          published_at: releases[0].published_at,
          html_url: releases[0].html_url,
        }
      : null,
    history: releases.map((r) => ({
      tag_name: r.tag_name,
      name: r.name,
      published_at: r.published_at,
      prerelease: r.prerelease,
      html_url: r.html_url,
    })),
  };
};

/**
 * Full analytics bundle used by /activity, /health, and /report.
 * Fetches everything in parallel and also persists a snapshot for
 * historical growth tracking.
 */
exports.getFullAnalytics = async (owner, repo, token) => {
  parseOwnerRepo(owner, repo);

  const [overview, languagesResult, contributors, commitActivity, issues, pulls, releases] =
    await Promise.all([
      exports.getOverview(owner, repo, token),
      exports.getLanguages(owner, repo, token),
      exports.getContributors(owner, repo, token),
      exports.getCommitActivity(owner, repo, token),
      exports.getIssues(owner, repo, token),
      exports.getPullRequests(owner, repo, token),
      exports.getReleases(owner, repo, token),
    ]);

  const health = calculateHealthScore({
    commitActivity: commitActivity.weeks,
    stars: overview.stars,
    forks: overview.forks,
    watchers: overview.watchers,
    contributorsCount: contributors.length,
    openIssues: issues.open,
    closedIssues: issues.closed,
    releaseCount: releases.total,
    description: overview.description,
  });

  const languages = languagesResult.languages.reduce((acc, l) => {
    acc[l.name] = l.bytes;
    return acc;
  }, {});

  const analytics = {
    repository: overview,
    languages,
    languagesBreakdown: languagesResult.languages,
    contributors,
    commitActivity,
    issues,
    pulls,
    releases,
    health,
  };

  // Best-effort persistence for historical tracking; never blocks the response.
  persistSnapshot(overview, contributors.length, commitActivity, health).catch(() => {});

  return analytics;
};

async function persistSnapshot(overview, contributorsCount, commitActivity, health) {
  const [repoRecord] = await Repository.findOrCreate({
    where: { github_id: overview.id },
    defaults: {
      github_id: overview.id,
      owner: overview.owner,
      repository_name: overview.name,
      description: overview.description,
      default_branch: overview.default_branch,
      language: null,
      stars: overview.stars,
      forks: overview.forks,
      watchers: overview.watchers,
      issues: overview.open_issues,
      license: overview.license,
      avatar: overview.avatar,
      html_url: overview.html_url,
    },
  });

  await repoRecord.update({
    stars: overview.stars,
    forks: overview.forks,
    watchers: overview.watchers,
    issues: overview.open_issues,
  });

  const totalCommits = (commitActivity.weeks || []).reduce((sum, w) => sum + (w.total || 0), 0);

  await AnalyticsSnapshot.create({
    repository_id: repoRecord.id,
    stars: overview.stars,
    forks: overview.forks,
    watchers: overview.watchers,
    contributors: contributorsCount,
    commits: totalCommits,
    health_score: health.score,
  });
}
