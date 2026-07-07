const axios = require('axios');
const AppError = require('../utils/appError');
const logger = require('../config/logger');

const GITHUB_API = 'https://api.github.com';

/**
 * Builds an axios client for GitHub's REST API.
 * Uses the caller's OAuth token when available (so private repos
 * and higher rate limits work for logged-in users), otherwise falls
 * back to a server-side GITHUB_TOKEN, otherwise goes unauthenticated.
 */
const client = (token) => {
  const authToken = token || process.env.GITHUB_TOKEN;
  return axios.create({
    baseURL: GITHUB_API,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    timeout: 15000,
  });
};

const handle = async (promise, notFoundMessage = 'Resource not found on GitHub') => {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    if (err.response) {
      const { status } = err.response;
      if (status === 404) throw new AppError(notFoundMessage, 404);
      if (status === 403 && err.response.headers['x-ratelimit-remaining'] === '0') {
        throw new AppError('GitHub API rate limit exceeded. Try again later or add a GITHUB_TOKEN.', 429);
      }
      throw new AppError(`GitHub API error: ${err.response.data?.message || err.message}`, status);
    }
    logger.error(`GitHub request failed: ${err.message}`);
    throw new AppError('Failed to reach GitHub API', 502);
  }
};

exports.searchRepositories = (query, token, page = 1, perPage = 12) =>
  handle(
    client(token).get('/search/repositories', {
      params: { q: query, per_page: perPage, page },
    })
  );

exports.getRepository = (owner, repo, token) =>
  handle(client(token).get(`/repos/${owner}/${repo}`), `Repository ${owner}/${repo} not found`);

exports.getLanguages = (owner, repo, token) =>
  handle(client(token).get(`/repos/${owner}/${repo}/languages`));

exports.getContributors = (owner, repo, token, perPage = 20) =>
  handle(
    client(token).get(`/repos/${owner}/${repo}/contributors`, {
      params: { per_page: perPage, anon: false },
    }),
    'No contributors found (repository may be empty or contributor list is private)'
  );

exports.getCommitActivity = (owner, repo, token) =>
  handle(client(token).get(`/repos/${owner}/${repo}/stats/commit_activity`));

exports.getCommits = (owner, repo, token, perPage = 30, page = 1) =>
  handle(
    client(token).get(`/repos/${owner}/${repo}/commits`, {
      params: { per_page: perPage, page },
    })
  );

exports.getIssues = (owner, repo, token, state = 'all', perPage = 50) =>
  handle(
    client(token).get(`/repos/${owner}/${repo}/issues`, {
      params: { state, per_page: perPage },
    })
  );

exports.getPullRequests = (owner, repo, token, state = 'all', perPage = 50) =>
  handle(
    client(token).get(`/repos/${owner}/${repo}/pulls`, {
      params: { state, per_page: perPage },
    })
  );

exports.getReleases = (owner, repo, token, perPage = 20) =>
  handle(client(token).get(`/repos/${owner}/${repo}/releases`, { params: { per_page: perPage } }));

exports.exchangeOAuthCode = async (code) => {
  const res = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    },
    { headers: { Accept: 'application/json' } }
  );
  if (res.data.error) {
    throw new AppError(res.data.error_description || 'GitHub OAuth exchange failed', 400);
  }
  return res.data.access_token;
};

exports.getAuthenticatedUser = (token) =>
  handle(client(token).get('/user'), 'Could not fetch GitHub user profile');
