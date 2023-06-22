import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
const crypto = require('crypto');
import Grid from 'gridfs-stream';
import { GridFsStorage } from 'multer-gridfs-storage';

class Upload {
    file = async () => {
        // const data = req.body.params;

        const URL = 'mongodb+srv://Spaceship:hung0507200301645615023@cluster0.chumwfw.mongodb.net/spaceship';
        let gfs;
        const conn = mongoose.createConnection(URL);
        conn.once('open', () => {
            gfs = Grid(conn.db, mongoose.mongo);
            gfs.collection('uploads');
        });
        const storage = new GridFsStorage({
            url: URL,
            file: (req: any, file: { originalname: any }) => {
                return new Promise((resolve, reject) => {
                    crypto.randomBytes(16, (err: any, buf: { toString: (arg0: string) => any }) => {
                        if (err) {
                            return reject(err);
                        }
                        const filename = buf.toString('hex') + path.extname(file.originalname);
                        const fileInfo = {
                            filename: filename,
                            bucketName: 'uploads',
                        };
                        resolve(fileInfo);
                    });
                });
            },
        });
        const upload = multer({ storage });
        // upload.fields(data.files[0].link);
        return upload;
        // return upload;
    };
}
export default new Upload();
