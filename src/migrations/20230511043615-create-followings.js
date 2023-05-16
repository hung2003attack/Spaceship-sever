'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('followings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_user: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      id_follow: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    })
      .then(() => {
        const sql = `ALTER TABLE followings ADD CONSTRAINT FRK_followings_users FOREIGN KEY (id_user) REFERENCES users(id)`;
        return queryInterface.sequelize.query(sql, { raw: true });
      })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('followings');
  }
};