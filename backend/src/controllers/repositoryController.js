const repositoryService = require('../services/repositoryService');
const { streamPdfReport, sendCsvReport, sendJsonReport } = require('../services/reportService');
const asyncHandler = require('../utils/asyncHandler');

const tokenFrom = (req) => req.user?.access_token || null;

exports.search = asyncHandler(async (req, res) => {
  const { q, page = 1, per_page = 12 } = req.query;
  const data = await repositoryService.search(q, tokenFrom(req), Number(page), Number(per_page));
  res.status(200).json({ status: true, data });
});

exports.getOverview = asyncHandler(async (req, res) => {
  const { owner, repo } = req.params;
  const data = await repositoryService.getOverview(owner, repo, tokenFrom(req));
  res.status(200).json({ status: true, data });
});

exports.getLanguages = asyncHandler(async (req, res) => {
  const { owner, repo } = req.params;
  const data = await repositoryService.getLanguages(owner, repo, tokenFrom(req));
  res.status(200).json({ status: true, data });
});

exports.getContributors = asyncHandler(async (req, res) => {
  const { owner, repo } = req.params;
  const data = await repositoryService.getContributors(owner, repo, tokenFrom(req));
  res.status(200).json({ status: true, data });
});

exports.getCommits = asyncHandler(async (req, res) => {
  const { owner, repo } = req.params;
  const data = await repositoryService.getCommitActivity(owner, repo, tokenFrom(req));
  res.status(200).json({ status: true, data });
});

exports.getIssues = asyncHandler(async (req, res) => {
  const { owner, repo } = req.params;
  const data = await repositoryService.getIssues(owner, repo, tokenFrom(req));
  res.status(200).json({ status: true, data });
});

exports.getPullRequests = asyncHandler(async (req, res) => {
  const { owner, repo } = req.params;
  const data = await repositoryService.getPullRequests(owner, repo, tokenFrom(req));
  res.status(200).json({ status: true, data });
});

exports.getReleases = asyncHandler(async (req, res) => {
  const { owner, repo } = req.params;
  const data = await repositoryService.getReleases(owner, repo, tokenFrom(req));
  res.status(200).json({ status: true, data });
});

exports.getActivity = asyncHandler(async (req, res) => {
  const { owner, repo } = req.params;
  const data = await repositoryService.getFullAnalytics(owner, repo, tokenFrom(req));
  res.status(200).json({ status: true, data });
});

exports.getHealth = asyncHandler(async (req, res) => {
  const { owner, repo } = req.params;
  const data = await repositoryService.getFullAnalytics(owner, repo, tokenFrom(req));
  res.status(200).json({ status: true, data: data.health });
});

exports.getReport = asyncHandler(async (req, res) => {
  const { owner, repo } = req.params;
  const format = (req.query.format || 'json').toLowerCase();
  const analytics = await repositoryService.getFullAnalytics(owner, repo, tokenFrom(req));

  if (format === 'pdf') return streamPdfReport(res, analytics);
  if (format === 'csv') return sendCsvReport(res, analytics);
  return sendJsonReport(res, analytics);
});
