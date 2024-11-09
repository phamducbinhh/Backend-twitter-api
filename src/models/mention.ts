'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize: any, DataTypes: any) => {
  class Mention extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Mention.belongsTo(models.User, { foreignKey: 'user_id' })
      Mention.belongsTo(models.Tweet, { foreignKey: 'tweet_id' })
    }
  }
  Mention.init(
    {
      tweet_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Mention',
      tableName: 'mentions'
    }
  )
  return Mention
}
