const { Bookmark, Repository } = require('../models');
const repositoryService = require('../services/repositoryService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

exports.list = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.findAll({
    where: { user_id: req.user.id },
    include: [{ model: Repository }],
    order: [['created_at', 'DESC']],
  });
  res.status(200).json({ status: true, data: bookmarks });
});

exports.create = asyncHandler(async (req, res) => {
  const { owner, repo } = req.body;
  if (!owner || !repo) throw new AppError('owner and repo are required', 400);

  const overview = await repositoryService.getOverview(owner, repo, req.user.access_token);

  const [repoRecord] = await Repository.findOrCreate({
    where: { github_id: overview.id },
    defaults: {
      github_id: overview.id,
      owner: overview.owner,
      repository_name: overview.name,
      description: overview.description,
      default_branch: overview.default_branch,
      stars: overview.stars,
      forks: overview.forks,
      watchers: overview.watchers,
      issues: overview.open_issues,
      license: overview.license,
      avatar: overview.avatar,
      html_url: overview.html_url,
    },
  });

  const [bookmark, created] = await Bookmark.findOrCreate({
    where: { user_id: req.user.id, repository_id: repoRecord.id },
  });

  if (!created) throw new AppError('Repository is already bookmarked', 409);

  res.status(201).json({ status: true, data: bookmark });
});

exports.remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Bookmark.destroy({ where: { id, user_id: req.user.id } });
  if (!deleted) throw new AppError('Bookmark not found', 404);
  res.status(200).json({ status: true, message: 'Bookmark removed' });
});
