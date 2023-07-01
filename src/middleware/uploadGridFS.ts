import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
const crypto = require('crypto');
import Grid from 'gridfs-stream';
import { GridFsStorage } from 'multer-gridfs-storage';
import { v4 as primaryKey } from 'uuid';
import express from 'express';
const router = express.Router();
const URL = 'mongodb+srv://Spaceship:hung0507200301645615023@cluster0.chumwfw.mongodb.net/spaceship';
let gfs: any;
const conn = mongoose.createConnection(URL);
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});
const storage = new GridFsStorage({
    url: URL,
    file: (req: any, files: { originalname: any }) => {
        return new Promise((resolve, reject) => {
            try {
                console.log(files, 'file');

                crypto.randomBytes(16, (err: any, buf: { toString: (arg0: string) => any }) => {
                    if (err) {
                        return reject(err);
                    }
                    const id = primaryKey();
                    const filename = buf.toString('hex') + path.extname(files.originalname);
                    const fileInfo = {
                        filename: filename,
                        bucketName: 'uploads',
                        metadata: {
                            id_file: id, // Trường để lưu _id của tệp tin
                        },
                    };
                    resolve(fileInfo);
                });
            } catch (error) {
                console.log(error);
            }
        });
    },
});
export const upload: any = multer({ storage });
