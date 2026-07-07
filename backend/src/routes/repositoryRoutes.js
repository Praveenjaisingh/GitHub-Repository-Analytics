const express = require('express');
const router = express.Router();

const controller = require('../controllers/repositoryController');
const { optionalAuth } = require('../middleware/auth');
const cacheMiddleware = require('../middleware/cache');
const {
  searchValidator,
  ownerRepoValidator,
  validate,
} = require('../validations/repositoryValidator');

/**
 * @swagger
 * /repositories/search:
 *   get:
 *     summary: Search public GitHub repositories
 *     tags: [Repositories]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: per_page
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of matching repositories }
 */
router.get('/search', optionalAuth, searchValidator, validate, cacheMiddleware(120), controller.search);

router.get('/:owner/:repo', optionalAuth, ownerRepoValidator, validate, cacheMiddleware(300), controller.getOverview);
router.get('/:owner/:repo/languages', optionalAuth, ownerRepoValidator, validate, cacheMiddleware(600), controller.getLanguages);
router.get('/:owner/:repo/contributors', optionalAuth, ownerRepoValidator, validate, cacheMiddleware(600), controller.getContributors);
router.get('/:owner/:repo/commits', optionalAuth, ownerRepoValidator, validate, cacheMiddleware(600), controller.getCommits);
router.get('/:owner/:repo/issues', optionalAuth, ownerRepoValidator, validate, cacheMiddleware(300), controller.getIssues);
router.get('/:owner/:repo/pulls', optionalAuth, ownerRepoValidator, validate, cacheMiddleware(300), controller.getPullRequests);
router.get('/:owner/:repo/releases', optionalAuth, ownerRepoValidator, validate, cacheMiddleware(600), controller.getReleases);
router.get('/:owner/:repo/activity', optionalAuth, ownerRepoValidator, validate, cacheMiddleware(600), controller.getActivity);
router.get('/:owner/:repo/health', optionalAuth, ownerRepoValidator, validate, cacheMiddleware(600), controller.getHealth);
router.get('/:owner/:repo/report', optionalAuth, ownerRepoValidator, validate, controller.getReport);

module.exports = router;
