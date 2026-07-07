const logger = require('../config/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.originalUrl });

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ status: false, errors: ['Malformed JSON body'] });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: false,
    errors: err.errors || [err.message || 'Internal server error'],
  });
};
