'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      github_id: { type: Sequelize.STRING, unique: true, allowNull: false },
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      avatar: Sequelize.STRING,
      access_token: Sequelize.STRING,
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    await queryInterface.createTable('repositories', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      github_id: { type: Sequelize.BIGINT, unique: true, allowNull: false },
      owner: { type: Sequelize.STRING, allowNull: false },
      repository_name: { type: Sequelize.STRING, allowNull: false },
      description: Sequelize.TEXT,
      default_branch: Sequelize.STRING,
      language: Sequelize.STRING,
      stars: { type: Sequelize.INTEGER, defaultValue: 0 },
      forks: { type: Sequelize.INTEGER, defaultValue: 0 },
      watchers: { type: Sequelize.INTEGER, defaultValue: 0 },
      issues: { type: Sequelize.INTEGER, defaultValue: 0 },
      license: Sequelize.STRING,
      avatar: Sequelize.STRING,
      html_url: Sequelize.STRING,
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex('repositories', ['owner', 'repository_name'], { unique: true });

    await queryInterface.createTable('analytics_snapshots', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      repository_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'repositories', key: 'id' },
        onDelete: 'CASCADE',
      },
      stars: Sequelize.INTEGER,
      forks: Sequelize.INTEGER,
      watchers: Sequelize.INTEGER,
      contributors: Sequelize.INTEGER,
      commits: Sequelize.INTEGER,
      health_score: Sequelize.FLOAT,
      snapshot_date: { type: Sequelize.DATEONLY, defaultValue: Sequelize.NOW },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    await queryInterface.createTable('bookmarks', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      repository_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'repositories', key: 'id' },
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex('bookmarks', ['user_id', 'repository_id'], { unique: true });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('bookmarks');
    await queryInterface.dropTable('analytics_snapshots');
    await queryInterface.dropTable('repositories');
    await queryInterface.dropTable('users');
  },
};
