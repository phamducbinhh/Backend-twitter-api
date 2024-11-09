'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tweets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      content: {
        type: Sequelize.TEXT
      },
      parent_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tweets',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      guest_views: {
        type: Sequelize.INTEGER
      },
      user_views: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM('Tweet', 'Retweet', 'Comment', 'QuoteTweet'),
        allowNull: false
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
    await queryInterface.dropTable('tweets')
  }
}
