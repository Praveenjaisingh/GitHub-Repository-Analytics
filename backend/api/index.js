require('dotenv').config();

// Vercel's Node.js runtime treats any exported (req, res) => {} handler
// as the serverless function — an Express app already has that shape,
// so we just export it directly. No app.listen() here: Vercel manages
// the HTTP server itself.
module.exports = require('../src/app');
