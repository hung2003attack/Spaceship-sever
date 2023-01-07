import express from 'express';
import route from './routes';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import viewEngine from './config/configEngine';
import Serve from './connectDatabase/connect';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routeSN from './routes/socialNetwork/index';
import os from 'os';
import compression from 'compression';
require('dotenv').config();
console.log('os', os.cpus().length); // thread

const app = express();
const port = process.env.PORT || 3001;

// app.use(compression({ nen file
//     level: 6,

// }))
app.use(cookieParser(process.env.SECRET));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

Serve.connect();

route(app);
routeSN(app);
viewEngine(app);

app.listen(port, () => {
    console.log(`connection successful port: ${port}`);
});
