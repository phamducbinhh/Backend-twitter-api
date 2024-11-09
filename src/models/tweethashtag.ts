'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize: any, DataTypes: any) => {
  class TweetHashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      TweetHashtag.belongsTo(models.Tweet, { foreignKey: 'tweet_id' })
      TweetHashtag.belongsTo(models.Hashtag, { foreignKey: 'hashtag_id' })
    }
  }
  TweetHashtag.init(
    {
      tweet_id: DataTypes.INTEGER,
      hashtag_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'TweetHashtag',
      tableName: 'tweet_hashtags'
    }
  )
  return TweetHashtag
}
