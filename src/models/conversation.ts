'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize: any, DataTypes: any) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Conversation.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' })
      Conversation.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'receiver' })
    }
  }
  Conversation.init(
    {
      content: DataTypes.TEXT,
      sender_id: DataTypes.INTEGER,
      receiver_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Conversation',
      tableName: 'conversations'
    }
  )
  return Conversation
}
