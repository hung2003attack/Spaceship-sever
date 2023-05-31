import express from 'express';
import route from './routes';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import viewEngine from './config/configEngine';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routeSN from './routes/websRoutes/index';
import os from 'os';
import compression from 'compression';
const Redis = require('ioredis');

import Server from './connectDatabase/connect';
import checkIP from './middleware/checkIP';
import jwtAuth from './middleware/jwtAuth';
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
export const io = require('socket.io')(server);
const connection = new Set();
export const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

// redisClient.get
console.log('os', os.cpus().length); // thread
io.on('connection', (client: any) => {
    console.log('conn');
    client.on('sendId', (res: string) => {
        connection.add(res);
        client.userId = res;
        console.log('user connected', res);
        client.emit('user connectedd', JSON.stringify(Array.from(connection)));
        client.broadcast.emit('user connectedd', JSON.stringify(Array.from(connection)));
    });
    client.on('disconnect', () => {
        connection.delete(client.userId);
        console.log('clien disconnect', client.userId);
        const key_private = client.userId + 'private';
        redisClient.lrange(key_private, 0, -1, (err: any, items: string[]) => {
            if (err) console.log(err);
            items.forEach((item) => {
                redisClient.del(item, (err: any, count: any) => {
                    if (err) console.log(err);
                    console.log(`Deleted ${count} key(s)`);
                });
            });
        });
        redisClient.del(key_private, (err: any, count: number) => {
            if (err) console.log(err);
            console.log(`Deleted ${count} key(s)`);
        });
        client.broadcast.emit('user disconnected', JSON.stringify(Array.from(connection)));
    });
    client.on('offline', (res: string) => {
        connection.delete(res);
        client.emit('user connectedd', JSON.stringify(Array.from(connection)));
        client.broadcast.emit('user connectedd', JSON.stringify(Array.from(connection)));
    });
    client.on('online', (res: string) => {
        connection.add(res);
        client.emit('user connectedd', JSON.stringify(Array.from(connection)));
        client.broadcast.emit('user connectedd', JSON.stringify(Array.from(connection)));
    });

    // user connected
});
const port = process.env.PORT || 3001;

// app.use(compression({ nen file
//     level: 6,

// }))
app.use((req: any, res: any, next) => {
    res.io = io;
    req.redisClient = redisClient;
    next();
});

app.use(cookieParser(process.env.SECRET));
app.use(cors({ origin: ['http://192.168.99.102:3000', 'http://localhost:3000'], credentials: true }));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(checkIP.requests);

Server.connect();
// Server.socket(io);

route(app);
app.use(jwtAuth.verifyToken);
routeSN(app);
viewEngine(app);

server.listen(port, () => {
    console.log(`connection successful port: ${port}`);
});
