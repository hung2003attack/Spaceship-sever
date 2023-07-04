import { file } from 'googleapis/build/src/apis/file';
import DateTime from '../../../DateTimeCurrent/DateTimeCurrent';
import { NewPost } from '../../../models/mongodb/SN_DB/home';

const db = require('../../../models');

class HomeServiceSN {
    setPost = (
        id: string,
        value: string,
        category: number,
        fontFamily: string,
        files: any,
        more: { title?: string; bg?: string; column?: number },
    ) => {
        return new Promise(async (resolve, reject) => {
            try {
                const imageOrVideos: any = files.map((f: any) => {
                    return {
                        file: f.metadata.id_file.toString(),
                        title: f.metadata.title,
                        options: more,
                    };
                });
                console.log(imageOrVideos, 'ids_file', value, fontFamily, id);
                // const res = await NewPost.create({
                //     id_user: id,
                //     content: {
                //         text: value,
                //         imageOrVideos: imageOrVideos,
                //     },
                //     createdAt: DateTime(),
                // });
                // console.log(res, 'res');

                // resolve(data);
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
