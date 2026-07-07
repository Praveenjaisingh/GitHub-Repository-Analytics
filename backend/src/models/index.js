const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const User = require('./user')(sequelize, DataTypes);
const Repository = require('./repository')(sequelize, DataTypes);
const AnalyticsSnapshot = require('./analyticsSnapshot')(sequelize, DataTypes);
const Bookmark = require('./bookmark')(sequelize, DataTypes);

// Associations
User.hasMany(Bookmark, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Bookmark.belongsTo(User, { foreignKey: 'user_id' });

Repository.hasMany(Bookmark, { foreignKey: 'repository_id', onDelete: 'CASCADE' });
Bookmark.belongsTo(Repository, { foreignKey: 'repository_id' });

Repository.hasMany(AnalyticsSnapshot, { foreignKey: 'repository_id', onDelete: 'CASCADE' });
AnalyticsSnapshot.belongsTo(Repository, { foreignKey: 'repository_id' });

module.exports = {
  sequelize,
  User,
  Repository,
  AnalyticsSnapshot,
  Bookmark,
};
