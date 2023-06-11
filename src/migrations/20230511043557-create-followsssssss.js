'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('follows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_following: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      id_followed: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      flwing: {
        type: Sequelize.INTEGER(1),
        defaultValue: 1,
        allowNull: false,
      },
      flwed: {
        type: Sequelize.INTEGER(1),
        defaultValue: 1,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,

      }
    })
      .then(() => {
        const sql = `ALTER TABLE follows ADD CONSTRAINT FRK_follows_users FOREIGN KEY (id_following) REFERENCES users(id)`;
        const sqls = `ALTER TABLE follows ADD CONSTRAINT FRK_followss_users FOREIGN KEY (id_followed) REFERENCES users(id)`;
        queryInterface.sequelize.query(sqls, { raw: true });
        return queryInterface.sequelize.query(sql, { raw: true });
      })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('follows');
  }
};