module.exports = (sequelize, DataTypes) => {
  const AnalyticsSnapshot = sequelize.define(
    'AnalyticsSnapshot',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      stars: DataTypes.INTEGER,
      forks: DataTypes.INTEGER,
      watchers: DataTypes.INTEGER,
      contributors: DataTypes.INTEGER,
      commits: DataTypes.INTEGER,
      health_score: DataTypes.FLOAT,
      snapshot_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'analytics_snapshots',
      underscored: true,
      updatedAt: false,
    }
  );

  return AnalyticsSnapshot;
};
