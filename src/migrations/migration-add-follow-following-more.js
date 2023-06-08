'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return [
            queryInterface.addColumn('mores', 'follow', {
                type: Sequelize.INTEGER(10),
                defaultValue: 0
            }),
            queryInterface.addColumn('mores', 'following', {
                type: Sequelize.INTEGER(10),
                defaultValue: 0
            })
        ]
    },

    async down(queryInterface, Sequelize) {
        return [queryInterface.addColumn('mores', 'follow', {
            type: Sequelize.INTEGER(10),
            defaultValue: 0
        }),
        queryInterface.addColumn('mores', 'following', {
            type: Sequelize.INTEGER(10),
            defaultValue: 0
        })]
    }
};