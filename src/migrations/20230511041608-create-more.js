'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_user: {
        type: Sequelize.STRING(50)
      },
      position: {
        type: Sequelize.STRING('20')
      },
      love: {
        type: Sequelize.INTEGER(10)
      },
      star: {
        type: Sequelize.INTEGER(10)
      },
      visit: {
        type: Sequelize.INTEGER(10)
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
        const sql = `ALTER TABLE mores ADD CONSTRAINT FRK_mores_users FOREIGN KEY (id_user) REFERENCES users(id)`;
        return queryInterface.sequelize.query(sql, { raw: true });
      })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mores');
  }
};