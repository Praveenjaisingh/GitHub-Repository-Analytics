const express = require('express');
const router = express.Router();

router.use('/repositories', require('./repositoryRoutes'));
router.use('/bookmarks', require('./bookmarkRoutes'));
router.use('/auth', require('./authRoutes'));

router.get('/health', (req, res) => {
  res.status(200).json({ status: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

module.exports = router;
