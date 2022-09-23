'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('friends',
      {
        idCurrentUser: Sequelize.STRING, idFriend: Sequelize.STRING
      }
    )
      .then(() => {
        const sql = `ALTER TABLE friends ADD CONSTRAINT FRK_friends_users FOREIGN KEY (idCurrentUser) REFERENCES users(id)`;
        return queryInterface.sequelize.query(sql, { raw: true });
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
