'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('relatives', {
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
      id_relative: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      really: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
        allowNull: false
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
        const sql = `ALTER TABLE relatives ADD CONSTRAINT FRK_relatives_users FOREIGN KEY (id_user) REFERENCES users(id)`;
        const sql2 = `ALTER TABLE relatives ADD CONSTRAINT FRK_relatives_re FOREIGN KEY (id_relative) REFERENCES users(id)`;
        queryInterface.sequelize.query(sql2, { raw: true })
        return queryInterface.sequelize.query(sql, { raw: true });
      })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('relatives');
  }
};