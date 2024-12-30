'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize: any, DataTypes: any) => {
  class Tweet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Tweet.belongsTo(models.User, { foreignKey: 'user_id' })
      Tweet.hasMany(models.Tweet, { foreignKey: 'parent_id' })
      Tweet.hasMany(models.TweetHashtag, { foreignKey: 'tweet_id' })
      Tweet.hasMany(models.Like, { foreignKey: 'tweet_id' })
      Tweet.hasMany(models.Bookmark, { foreignKey: 'tweet_id' })
      Tweet.hasMany(models.TweetMedia, { foreignKey: 'tweet_id' })
      Tweet.hasMany(models.Mention, { foreignKey: 'tweet_id' })
    }
  }
  Tweet.init(
    {
      user_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      parent_id: DataTypes.INTEGER,
      guest_views: DataTypes.INTEGER,
      user_views: DataTypes.INTEGER,
      type: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Tweet',
      tableName: 'tweets'
    }
  )
  return Tweet
}
