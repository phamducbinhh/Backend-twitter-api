'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize: any, DataTypes: any) => {
  class Hashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Hashtag.hasMany(models.TweetHashtag, { foreignKey: 'hashtag_id' })
    }
  }
  Hashtag.init(
    {
      name: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Hashtag',
      tableName: 'hashtags'
    }
  )
  return Hashtag
}
