'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable('tokens', {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    type: Sequelize.STRING,
                },
                accessToken: {
                    type: Sequelize.TEXT,
                },
            })
            .then(() => {
                const sql = `ALTER TABLE tokens ADD CONSTRAINT FRK_tokens_users FOREIGN KEY (id) REFERENCES users(id)`;
                return queryInterface.sequelize.query(sql, { raw: true });
            });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('tokens');
    },
};
