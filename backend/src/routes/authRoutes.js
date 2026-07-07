const express = require('express');
const router = express.Router();

const controller = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.get('/github', controller.redirectToGithub);
router.get('/github/callback', controller.githubCallback);
router.get('/me', requireAuth, controller.getCurrentUser);
router.post('/logout', requireAuth, controller.logout);

module.exports = router;
