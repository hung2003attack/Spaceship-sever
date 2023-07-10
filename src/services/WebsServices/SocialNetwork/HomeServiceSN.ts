import { file } from 'googleapis/build/src/apis/file';
import DateTime from '../../../DateTimeCurrent/DateTimeCurrent';
import { NewPost } from '../../../models/mongodb/SN_DB/home';
import { ExpChucks } from '../../../middleware/uploadGridFS';

const db = require('../../../models');

class HomeServiceSN {
    setPost = (
        id: string,
        value: string,
        category: number,
        fontFamily: string,
        files: any,
        more: { title?: string; bg?: string; column?: number },
        expire: number,
        privates: { id: number; name: string }[],
        imotigons: { id: number; name: string }[],
    ) => {
        return new Promise(async (resolve, reject) => {
            try {
                const id_c = files.map((f: any) => f.id);
                const imageOrVideos: any = files.map((f: any) => {
                    console.log(f.id, 'ff', f);
                    ExpChucks(f.id, 12);

                    return {
                        file: f.metadata.id_file.toString(),
                        title: f.metadata.title,
                        options: more,
                    };
                });
                console.log(imageOrVideos, 'ids_file', value, fontFamily, id);
                if (expire) {
                    const res = await NewPost.create({
                        id_user: id,
                        content: {
                            text: value,
                            imageOrVideos: imageOrVideos,
                        },
                        feel: {
                            only: imotigons,
                        },
                        createdAt: DateTime(),
                        expireAfterSeconds: expire,
                    });
                    console.log(res, 'res expire');
                    resolve({ data: res, id_c });
                } else {
                    const res = await NewPost.create({
                        id_user: id,
                        content: {
                            text: value,
                            imageOrVideos: imageOrVideos,
                        },
                        feel: {
                            only: imotigons,
                        },
                        createdAt: DateTime(),
                    });
                    console.log(res, 'res no expire');
                    resolve({ data: res, id_c });
                }
            } catch (err) {
                reject(err);
            }
        });
    };
    getPost = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await db.users.findAll({
                    attributes: ['id', 'fullName', 'avatar'],
                    raw: true,
                });

                resolve(data);
            } catch (err) {
                reject(err);
            }
        });
    };
}
export default new HomeServiceSN();
