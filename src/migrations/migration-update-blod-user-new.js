'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.changeColumn('users', 'avatar', {
            type: Sequelize.BLOB('long'),
            allowNull: true
        }
        )
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.changeColumn('users', 'avatar', {
            type: Sequelize.BLOB('long'),
            allowNull: true
        }
        )
    }
};