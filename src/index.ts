import express from 'express';
import route from './routes';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import viewEngine from './config/configEngine';
import Connection from './connectDatabase/connect';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routeSN from './routes/socialNetwork/index';
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

Connection();
route(app);
routeSN(app);
viewEngine(app);

app.listen(port, () => {
    console.log(`connection successful port: ${port}`);
});
