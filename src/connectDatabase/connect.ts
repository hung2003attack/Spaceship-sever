const { Sequelize } = require('sequelize');
import mongoose from 'mongoose';

require('dotenv').config();
class Server {
    ConnectMySQL() {
        const sequelize = new Sequelize(
            process.env.DB_DATABASENAME || 'spaceship',
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 3307,
                dialect: 'mysql',
                pool: {
                    max: 5,
                    min: 0,
                    idle: 10000,
                },
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
    socket = (io: any) => {
        const online = new Set();
    };

    ConnectMongoDB = async () => {
        try {
            const URL = 'mongodb+srv://Spaceship:hung0507200301645615023@cluster0.chumwfw.mongodb.net/spaceship';
            await mongoose.connect(URL);
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

export default new Server();
