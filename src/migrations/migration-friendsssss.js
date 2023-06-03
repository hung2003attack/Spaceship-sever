'use strict';
const moment = require('moment');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('friends',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        idCurrentUser: { type: Sequelize.STRING(50), allowNull: false },
        idFriend: { type: Sequelize.STRING(50), allowNull: false },
        level: { type: Sequelize.INTEGER(1), allowNull: false, defaultValue: 1 },
        createdAt: { type: Sequelize.DATE, allowNull: false, }
      }
    )
      .then(() => {
        const sql1 = `ALTER TABLE friends ADD CONSTRAINT FRK_friends_users1 FOREIGN KEY (idCurrentUser) REFERENCES users(id)`;
        const sql2 = `ALTER TABLE friends ADD CONSTRAINT FRK_friends_users2 FOREIGN KEY (idFriend) REFERENCES users(id)`;
        queryInterface.sequelize.query(sql2, { raw: true });
        return queryInterface.sequelize.query(sql1, { raw: true });
      })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
