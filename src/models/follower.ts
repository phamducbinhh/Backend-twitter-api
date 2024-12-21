'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize: any, DataTypes: any) => {
  class Follower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Follower.belongsTo(models.User, { foreignKey: 'user_id', as: 'FollowerUser' })
      Follower.belongsTo(models.User, { foreignKey: 'followed_user_id', as: 'FollowedUser' })
    }
  }
  Follower.init(
    {
      user_id: DataTypes.INTEGER,
      followed_user_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Follower',
      tableName: 'followers'
    }
  )
  return Follower
}
