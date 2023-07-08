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
    const collection = gfs.collection('uploads');
    collection.createIndex({ 'metadata.expireAt': 1 }, { expireAfterSeconds: 0 });
});
const storage = new GridFsStorage({
    url: URL,
    file: (req: any, files: { originalname: any }) => {
        return new Promise((resolve, reject) => {
            try {
                let expireAt: any = undefined;
                const expires = Number(req.body.expire);
                if (expires)
                    (expireAt = new Date(Date.now() + 60 * 1000)), console.log(files, 'file', 'title', expires);

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
                            title: files.originalname !== 'blob' ? files.originalname : '',
                            // expireAt,
                        },
                    };
                    if (expires) {
                        const filesCollection = gfs.collection('uploads.files');
                        const expirationSeconds = 3600; // Set the expiration time in seconds
                        filesCollection.createIndex({ uploadDate: 1 }, { expireAfterSeconds: 120 });
                    }
                    resolve(fileInfo);
                });
            } catch (error) {
                reject(error);
            }
        });
    },
});
export const upload: any = multer({ storage });
