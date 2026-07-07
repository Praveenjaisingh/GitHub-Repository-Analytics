module.exports = (sequelize, DataTypes) => {
  const Repository = sequelize.define(
    'Repository',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      github_id: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false,
      },
      owner: { type: DataTypes.STRING, allowNull: false },
      repository_name: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      default_branch: DataTypes.STRING,
      language: DataTypes.STRING,
      stars: { type: DataTypes.INTEGER, defaultValue: 0 },
      forks: { type: DataTypes.INTEGER, defaultValue: 0 },
      watchers: { type: DataTypes.INTEGER, defaultValue: 0 },
      issues: { type: DataTypes.INTEGER, defaultValue: 0 },
      license: DataTypes.STRING,
      avatar: DataTypes.STRING,
      html_url: DataTypes.STRING,
    },
    {
      tableName: 'repositories',
      underscored: true,
      indexes: [{ unique: true, fields: ['owner', 'repository_name'] }],
    }
  );

  return Repository;
};
