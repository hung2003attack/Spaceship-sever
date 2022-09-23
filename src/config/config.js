require('dotenv').config();
module.exports = {
    development: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'hung01645615023',
        database: process.env.DB_DATABASE || 'connectWorld',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3037,
        dialect: 'mysql',
        logging: false,
        define: {
            timestamps: false,
        },
    },
    test: {
        username: 'root',
        password: null,
        database: 'database_test',
        host: '127.0.0.1',
        dialect: 'mysql',
    },
    production: {
        username: 'root',
        password: null,
        database: 'database_production',
        host: '127.0.0.1',
        dialect: 'mysql',
    },
};
