'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('loves', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_user: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            id_loved: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE
            }
        })
            .then(() => {
                const sql = `ALTER TABLE loves ADD CONSTRAINT FRK_loves_users FOREIGN KEY (id_user) REFERENCES users(id)`;
                const sqls = `ALTER TABLE loves ADD CONSTRAINT FRK_lovess_users FOREIGN KEY (id_loved) REFERENCES users(id)`;
                queryInterface.sequelize.query(sqls, { raw: true });
                return queryInterface.sequelize.query(sql, { raw: true });
            })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('loves');
    }
};