'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.changeColumn('mores', 'id_user', {
            type: Sequelize.STRING(50),
            unique: true,
            allowNull: false
        }
        )
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.changeColumn('mores', 'id_user', {
            type: Sequelize.STRING(50),
            unique: true,
            allowNull: false
        }
        )
    }
};