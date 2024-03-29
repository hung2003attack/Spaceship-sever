'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.STRING(50),
            },
            phoneNumberEmail: { type: Sequelize.STRING, allowNull: false },
            password: { type: Sequelize.STRING, allowNull: false },
            fullName: {
                allowNull: false,
                type: Sequelize.STRING(30),
            },
            avatar: {
                type: Sequelize.BLOB('long'),
                allowNull: true,
            },
            status: { type: Sequelize.STRING(50) },
            nickName: { type: Sequelize.STRING(30) },
            gender: { type: Sequelize.INTEGER(1) },
            birthday: { type: Sequelize.STRING(13), allowNull: false },

            background: { type: Sequelize.TEXT },
            admin: { type: Sequelize.BOOLEAN, default: true },
            hobby: { type: Sequelize.STRING(500) },
            strengths: { type: Sequelize.STRING(500) },
            address: { type: Sequelize.STRING(250) },
            skill: { type: Sequelize.STRING(500) },
            occupation: { type: Sequelize.STRING(500) },
            experience: { type: Sequelize.STRING(500) },
            sn:
            {
                type: Sequelize.STRING(3),
                defaultValue: "vi",
                allowNull: false
            }, l:
            {
                type: Sequelize.STRING(3),
                defaultValue: "vi",
                allowNull: false
            },
            w: {
                type: Sequelize.STRING(3),
                defaultValue: "vi",
                allowNull: false
            },
            createdAt: { type: Sequelize.DATE, },
            updatedAt: { type: Sequelize.DATE },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('users');
    },
};
