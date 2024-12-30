'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      User.hasMany(models.Tweet, { foreignKey: 'user_id' })
      User.hasMany(models.Follower, { foreignKey: 'user_id', as: 'followers' })
      User.hasMany(models.Like, { foreignKey: 'user_id' })
      User.hasMany(models.Bookmark, { foreignKey: 'user_id' })
      User.hasMany(models.Mention, { foreignKey: 'user_id' })
      User.hasMany(models.RefreshToken, { foreignKey: 'user_id' })
      User.hasMany(models.Follower, { foreignKey: 'followed_user_id' })
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      date_of_birth: DataTypes.DATE,
      password: DataTypes.STRING,
      email_verify_token: DataTypes.STRING,
      forgot_password_token: DataTypes.STRING,
      bio: DataTypes.TEXT,
      location: DataTypes.STRING,
      website: DataTypes.STRING,
      verify_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      username: DataTypes.STRING,
      cover_photo: DataTypes.STRING,
      avatar: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users'
    }
  )
  return User
}
