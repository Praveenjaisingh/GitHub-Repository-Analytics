/**
 * Computes a 0-100 "health score" for a repository from a weighted
 * blend of activity, popularity, community, and maintenance signals.
 *
 * Weights (sum to 100):
 *  - Recent commit activity ......... 25
 *  - Popularity (stars/forks) ....... 15
 *  - Active contributors ............ 15
 *  - Issue resolution ratio ......... 15
 *  - Release frequency .............. 10
 *  - Documentation (README/desc) .... 10
 *  - Community engagement (watchers) 10
 */
const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

function scoreCommitActivity(commitActivity = []) {
  const last12Weeks = commitActivity.slice(-12);
  const total = last12Weeks.reduce((sum, w) => sum + (w.total || 0), 0);
  // 100+ commits in 12 weeks => full marks
  return clamp((total / 100) * 25, 0, 25);
}

function scorePopularity(stars = 0, forks = 0) {
  const raw = Math.log10(stars + 1) * 6 + Math.log10(forks + 1) * 4;
  return clamp(raw, 0, 15);
}

function scoreContributors(count = 0) {
  // 20+ contributors => full marks
  return clamp((count / 20) * 15, 0, 15);
}

function scoreIssueResolution(openIssues = 0, closedIssues = 0) {
  const total = openIssues + closedIssues;
  if (total === 0) return 10; // no issues at all isn't necessarily bad
  const ratio = closedIssues / total;
  return clamp(ratio * 15, 0, 15);
}

function scoreReleases(releaseCount = 0) {
  return clamp((releaseCount / 10) * 10, 0, 10);
}

function scoreDocumentation(description) {
  if (!description) return 2;
  return description.length > 40 ? 10 : 6;
}

function scoreEngagement(watchers = 0) {
  return clamp((Math.log10(watchers + 1) / Math.log10(1000)) * 10, 0, 10);
}

function calculateHealthScore({
  commitActivity,
  stars,
  forks,
  watchers,
  contributorsCount,
  openIssues,
  closedIssues,
  releaseCount,
  description,
}) {
  const breakdown = {
    commitActivity: Number(scoreCommitActivity(commitActivity).toFixed(1)),
    popularity: Number(scorePopularity(stars, forks).toFixed(1)),
    contributors: Number(scoreContributors(contributorsCount).toFixed(1)),
    issueResolution: Number(scoreIssueResolution(openIssues, closedIssues).toFixed(1)),
    releaseFrequency: Number(scoreReleases(releaseCount).toFixed(1)),
    documentation: Number(scoreDocumentation(description).toFixed(1)),
    communityEngagement: Number(scoreEngagement(watchers).toFixed(1)),
  };

  const total = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  const score = Math.round(clamp(total, 0, 100));

  let rating;
  if (score >= 90) rating = 5;
  else if (score >= 75) rating = 4;
  else if (score >= 55) rating = 3;
  else if (score >= 35) rating = 2;
  else rating = 1;

  return { score, rating, breakdown };
}

module.exports = { calculateHealthScore };
