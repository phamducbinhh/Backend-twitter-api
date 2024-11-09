'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize: any, DataTypes: any) => {
  class Bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Bookmark.belongsTo(models.User, { foreignKey: 'user_id' })
      Bookmark.belongsTo(models.Tweet, { foreignKey: 'tweet_id' })
    }
  }
  Bookmark.init(
    {
      user_id: DataTypes.INTEGER,
      tweet_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Bookmark',
      tableName: 'bookmarks'
    }
  )
  return Bookmark
}
