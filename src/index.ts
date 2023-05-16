import express from 'express';
import route from './routes';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import viewEngine from './config/configEngine';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routeSN from './routes/websRoutes/socialNetwork/index';
import os from 'os';
import compression from 'compression';
const Redis = require('ioredis');

import Server from './connectDatabase/connect';
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
export const io = require('socket.io')(server);

export const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});
io.on('connection', (client: any) => {
    console.log('connected', client.id);
    client.on('disconnect', () => {
        console.log('clien disconnect', client.id);
    });
    client.on('message request add friend', (msg: string) => {
        console.log('received message' + msg);
        io.emit(`Request others?id=${JSON.parse(msg).id_friend}`, msg);
    });
});
console.log('os', os.cpus().length); // thread

const port = process.env.PORT || 3001;

// app.use(compression({ nen file
//     level: 6,

// }))
app.use(cookieParser(process.env.SECRET));
app.use(cors({ origin: ['http://192.168.0.104:3000', 'http://localhost:3000'], credentials: true }));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

Server.connect();

route(app);
routeSN(app);
viewEngine(app);

server.listen(port, () => {
    console.log(`connection successful port: ${port}`);
});
