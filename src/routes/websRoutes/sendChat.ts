import express from 'express';
import JWTVERIFY from '../../middleware/jwtAuth';
import sendChatController from '../../controllers/websController/sendChatController';
import uploadGridFS from '../../middleware/uploadGridFS';
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
export const getFileById = async (_id: any) => {
    console.log(_id, 'get file');
    const file_ss = [];
    return new Promise((resolve, reject) => {
        try {
            const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'uploads' });
            gfs.files.findOne({ metadata: { id_file: _id } }, async (err: any, file: any) => {
                console.log(file, 'file herer');
                if (!file || file.length === 0) {
                    return { err: 'No file exists', status: 404 };
                }

                // Check if image
                if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                    const downloadStream = bucket.openDownloadStream(file._id);
                    const file_b = bucket.find({ filename: file.filename }).toArray((err: any, result: any) => {
                        if (err) console.log(err);
                        if (!result || result.length === 0) {
                            console.log('File not found');
                        }
                        console.log(result, 'file image');
                    });
                    downloadStream.on('data', (data) => {
                        console.log(data, 'dât');
                        resolve(data);
                    });

                    downloadStream.on('end', () => {
                        console.log('end');
                    });

                    downloadStream.on('error', (error) => {
                        // Handle the error
                        console.error('Error while reading the file:', error);
                    });
                    // Read output to browser
                    // const fileStream = gfs.createReadStream(file.filename);
                    // fileStream.on('data', (data: any) => {
                    //     // Xử lý dữ liệu đọc được
                    //     console.log(data, 'start');
                    // });

                    // // Xử lý sự kiện khi kết thúc stream
                    // fileStream.on('end', () => {
                    //     // Hoàn thành việc đọc tệp tin
                    //     console.log('Đã hoàn thành đọc tệp tin');
                    // });

                    // // Xử lý sự kiện khi có lỗi xảy ra trong quá trình đọc stream
                    // fileStream.on('error', (error: any) => {
                    //     // Xử lý lỗi
                    //     console.log('Lỗi khi đọc tệp tin:', error);
                    // });
                    // readstream.pipe(res);
                } else {
                    console.log('Not Images');
                }
            });

            // const fileStream = bucket.openDownloadStream(_id);

            // // Xử lý sự kiện khi đọc stream
            // fileStream.on('data', (data: any) => {
            //     // Xử lý dữ liệu đọc được
            //     console.log(data, 'start');
            // });

            // // Xử lý sự kiện khi kết thúc stream
            // fileStream.on('end', () => {
            //     // Hoàn thành việc đọc tệp tin
            //     console.log('Đã hoàn thành đọc tệp tin');
            // });

            // // Xử lý sự kiện khi có lỗi xảy ra trong quá trình đọc stream
            // fileStream.on('error', (error: any) => {
            //     // Xử lý lỗi
            //     console.log('Lỗi khi đọc tệp tin:', error);
            // });
        } catch (error) {
            reject(error);
        }
    });
};

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
export default router;
