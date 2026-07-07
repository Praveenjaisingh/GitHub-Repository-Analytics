module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      github_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      avatar: DataTypes.STRING,
      // GitHub OAuth access token, only used server-side to fetch
      // private repos on the user's behalf. Never returned to the client.
      access_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      underscored: true,
      defaultScope: {
        attributes: { exclude: ['access_token'] },
      },
      scopes: {
        withToken: { attributes: {} },
      },
    }
  );

  return User;
};
