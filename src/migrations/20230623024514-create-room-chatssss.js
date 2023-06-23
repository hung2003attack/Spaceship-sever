'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roomChats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_user: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      id_room: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }).then(() => {
      const sql = `ALTER TABLE roomChats ADD CONSTRAINT FRK_roomChats_users FOREIGN KEY (id_user) REFERENCES users(id)`;
      return queryInterface.sequelize.query(sql, { raw: true });
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('roomChats');
  }
};