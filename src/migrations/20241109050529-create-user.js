'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      date_of_birth: {
        type: Sequelize.DATE
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email_verify_token: {
        type: Sequelize.STRING
      },
      forgot_password_token: {
        type: Sequelize.STRING
      },
      bio: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      verify_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0 // Unverified
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      cover_photo: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('users')
  }
}
