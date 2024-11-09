'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tweet_hashtags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tweet_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tweets',
          key: 'id'
        },
        onDelete: 'SET NULL',
        unique: true
      },
      hashtag_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'hashtags',
          key: 'id'
        },
        onDelete: 'SET NULL',
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    })
  },
  async down(queryInterface) {
    await queryInterface.dropTable('tweet_hashtags')
  }
}
