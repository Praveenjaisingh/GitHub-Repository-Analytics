const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { User } = require('../models');

const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired session, please log in again', 401));
    }
    next(err);
  }
};

/**
 * Optional auth: attaches req.user if a valid token is present,
 * but does not block the request when it's missing/invalid.
 * Useful for routes that behave differently for logged-in users
 * (e.g. accessing private repos) without requiring login for public data.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (user) req.user = user;
  } catch (err) {
    // ignore invalid token for optional auth
  }
  next();
};

module.exports = { requireAuth, optionalAuth };
