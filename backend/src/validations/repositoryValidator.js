const { query, param, validationResult } = require('express-validator');

exports.searchValidator = [
  query('q').notEmpty().withMessage('Query parameter "q" is required'),
];

exports.ownerRepoValidator = [
  param('owner').notEmpty().withMessage('owner is required'),
  param('repo').notEmpty().withMessage('repo is required'),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      errors: errors.array().map((e) => e.msg),
    });
  }
  next();
};
