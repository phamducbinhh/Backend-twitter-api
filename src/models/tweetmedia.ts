'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize: any, DataTypes: any) => {
  class TweetMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      TweetMedia.belongsTo(models.Tweet, { foreignKey: 'tweet_id' })
      TweetMedia.belongsTo(models.Media, { foreignKey: 'media_id' })
    }
  }
  TweetMedia.init(
    {
      tweet_id: DataTypes.INTEGER,
      media_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'TweetMedia',
      tableName: 'tweet_media'
    }
  )
  return TweetMedia
}
