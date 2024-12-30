'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize: any, DataTypes: any) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Media.hasMany(models.TweetMedia, { foreignKey: 'media_id' })
    }
  }
  Media.init(
    {
      url: DataTypes.STRING,
      type: DataTypes.INTEGER // 0: image, 1: video
    },
    {
      sequelize,
      modelName: 'Media',
      tableName: 'media'
    }
  )
  return Media
}
