'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_message: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }).then(() => {
      const sql1 = `ALTER TABLE messages ADD CONSTRAINT FRK_messages1_users FOREIGN KEY (id_message) REFERENCES friends(id_message)`;

      return queryInterface.sequelize.query(sql1, { raw: true });
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('messages');
  }
};