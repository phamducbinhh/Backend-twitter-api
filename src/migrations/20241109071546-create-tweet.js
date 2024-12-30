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
      audience: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0 // 0: Tweet, 1: Retweet, 2: Comment, 3: Quote Tweet
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
