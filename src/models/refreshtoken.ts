'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize: any, DataTypes: any) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      RefreshToken.belongsTo(models.User, { foreignKey: 'user_id' })
    }
  }
  RefreshToken.init(
    {
      token: DataTypes.STRING,
      user_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'RefreshToken',
      tableName: 'refresh_tokens'
    }
  )
  return RefreshToken
}
