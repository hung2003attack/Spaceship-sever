'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.changeColumn('users', 'background', {
            type: Sequelize.BLOB('long'),
            allowNull: true
        }
        )
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.changeColumn('users', 'background', {
            type: Sequelize.BLOB('long'),
            allowNull: true
        }
        )
    }
};