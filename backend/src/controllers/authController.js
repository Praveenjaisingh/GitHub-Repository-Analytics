const jwt = require('jsonwebtoken');
const github = require('../services/githubService');
const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });


exports.redirectToGithub = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_CALLBACK_URL,
    scope: 'read:user repo',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};


exports.githubCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;
  if (!code) throw new AppError('Missing OAuth code from GitHub', 400);

  const accessToken = await github.exchangeOAuthCode(code);
  const profile = await github.getAuthenticatedUser(accessToken);

  const [user] = await User.scope('withToken').findOrCreate({
    where: { github_id: String(profile.id) },
    defaults: {
      github_id: String(profile.id),
      name: profile.name || profile.login,
      email: profile.email,
      avatar: profile.avatar_url,
      access_token: accessToken,
    },
  });

  await user.update({
    name: profile.name || profile.login,
    avatar: profile.avatar_url,
    access_token: accessToken,
  });

  const jwtToken = signToken(user.id);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  res.redirect(`${clientUrl}/oauth/callback?token=${jwtToken}`);
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: true,
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    },
  });
});

exports.logout = (req, res) => {
  res.status(200).json({ status: true, message: 'Logged out' });
};
