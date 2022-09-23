'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.STRING,
            },
            fullName: {
                allowNull: false,
                type: Sequelize.STRING(30),
            },
            status: { type: Sequelize.STRING(50) },
            nickName: { type: Sequelize.STRING(30) },
            phoneNumberEmail: { type: Sequelize.STRING, allowNull: false },
            password: { type: Sequelize.STRING, allowNull: false },
            gender: { type: Sequelize.INTEGER(1) },
            birthDate: { type: Sequelize.STRING(13), allowNull: false },
            avatar: { type: Sequelize.TEXT, },
            background: { type: Sequelize.TEXT },
            admin: { type: Sequelize.BOOLEAN, default: true },
            idToken: { type: Sequelize.STRING, allowNull: false, unique: true },
            hobby: { type: Sequelize.STRING(500) },
            strengths: { type: Sequelize.STRING(500) },
            adress: { type: Sequelize.STRING },
            skill: { type: Sequelize.STRING(500) },
            occupation: { type: Sequelize.STRING(500) },
            experience: { type: Sequelize.STRING(500) },
            createdAt: { type: Sequelize.DATE },
            updatedAt: { type: Sequelize.DATE },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('users');
    },
};
