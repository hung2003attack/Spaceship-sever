'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'lg',
      {
        type: Sequelize.STRING(2),
        defaultValue: 'VN',
        allowNull: false
      }
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'users',
      'lg'
    );
  }
};

