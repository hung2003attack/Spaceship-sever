import express from 'express';
import JWTVERIFY from '../../middleware/jwtAuth';
import sendChatController from '../../controllers/websController/sendChatController';
import mongoose from 'mongoose';
import multer from 'multer';
import { v4 as primaryKey } from 'uuid';

import path from 'path';
const crypto = require('crypto');
import Grid from 'gridfs-stream';
import { GridFsStorage } from 'multer-gridfs-storage';
const { GridFSBucket } = require('mongodb');
const { MongoClient, ObjectId } = require('mongodb');
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
const upload = multer({ storage });
router.post('/send', upload.array('files'), sendChatController.send);

router.get('/getRoom', sendChatController.getRoom);
router.get('/getChat', sendChatController.getChat);
router.get('/getFile', async (req: any, res: any) => {
    const id_file = req.query.id_file;
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'uploads' });
    await gfs.files.findOne({ metadata: { id_file } }, async (err: any, file: any) => {
        if (!file || file.length === 0) {
            return res.status(404).json('Files are not exist!');
        }
        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            let dataTest: any = '';
            const file_ss: any = [];
            const downloadStream = bucket.openDownloadStream(file._id);
            downloadStream.on('data', (data) => {
                file_ss.push(data);
            });
            downloadStream.on('end', () => {
                const buffer = Buffer.concat(file_ss);
                return res.status(200).json({ type: file.contentType, file: buffer });
            });

            downloadStream.on('error', (error) => {
                // Handle the error
                console.error('Error while reading the file:', error);
            });
        }
    });
});
export default router;
