module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define(
    'Bookmark',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: 'bookmarks',
      underscored: true,
      updatedAt: false,
      indexes: [{ unique: true, fields: ['user_id', 'repository_id'] }],
    }
  );

  return Bookmark;
};
