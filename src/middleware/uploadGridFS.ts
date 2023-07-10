import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
const crypto = require('crypto');
import Grid from 'gridfs-stream';
import { GridFsStorage } from 'multer-gridfs-storage';
import { v4 as primaryKey } from 'uuid';
import express from 'express';
const { ObjectId } = require('mongodb');

const router = express.Router();
const URL = 'mongodb+srv://Spaceship:hung0507200301645615023@cluster0.chumwfw.mongodb.net/spaceship';
let gfs: any;
let conllection: any;
const conn = mongoose.createConnection(URL);
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    conllection = gfs.collection('uploads');
    conllection.createIndex({ uploadDate: 1 }, { expireAfterSeconds: 0 });
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
                            expireAt,
                        },
                    };
                    resolve(fileInfo);
                });
            } catch (error) {
                reject(error);
            }
        });
    },
});
export const upload: any = multer({ storage });
export const ExpChucks = async (id: string, expireAt: number) => {
    console.log('ss');

    // setTimeout(async () => {
    try {
        const chunksCollection = conn.db.collection('uploads.chunks');
        console.log(ObjectId(id), 'files_id', expireAt);
    } catch (error) {
        console.log(error);
    }
    // }, expireAt);
};
