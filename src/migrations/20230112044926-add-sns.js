'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'sn',
      {
        type: Sequelize.STRING(3),
        defaultValue: "VN",
        allowNull: false
      }
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'users',
      'sn'
    );
  }
}
