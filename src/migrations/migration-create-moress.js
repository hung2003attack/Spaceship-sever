'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('mores', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_user: {
                type: Sequelize.STRING(50),
                unique: true,
            },
            position: {
                type: Sequelize.STRING('20'),
                defaultValue: 'user'
            },

            star: {
                type: Sequelize.INTEGER(10),
                defaultValue: 0
            },
            visit: {
                type: Sequelize.INTEGER(10),
                defaultValue: 0
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE
            }
        })
            .then(() => {
                const sql = `ALTER TABLE mores ADD CONSTRAINT FRK_mores_users FOREIGN KEY (id_user) REFERENCES users(id)`;
                return queryInterface.sequelize.query(sql, { raw: true });
            })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('mores');
    }
};