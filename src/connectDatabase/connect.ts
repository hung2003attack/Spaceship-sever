const { Sequelize } = require('sequelize');
import mongoose from 'mongoose';
require('dotenv').config();

class Sever {
    ConnectMySQL() {
        const sequelize = new Sequelize(
            process.env.DB_DATABASENAME || 'spaceship',
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
    ConnectMongoDB = async () => {
        try {
            await mongoose.connect(
                'mongodb+srv://Spaceship:hung0507200301645615023@cluster0.chumwfw.mongodb.net/spaceship',
            );
            console.log('Connected to MongoDB Successful!');
        } catch (error) {
            console.log('Connected to MongoDB Faild!');
        }
    };
    connect = async () => {
        await this.ConnectMySQL();
        this.ConnectMongoDB();
    };
}

export default new Sever();
