const { Sequelize } = require('sequelize');
require('dotenv').config();

function Connection() {
    const sequelize = new Sequelize(
        process.env.DB_DATABASENAME || 'connectWorld',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || 'hung01645615023',
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3307,
            dialect: 'mysql',
        },
    );

    const connectDB = async () => {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    };
    connectDB();
}

export default Connection;
