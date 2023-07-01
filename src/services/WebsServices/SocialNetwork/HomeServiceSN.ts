import { NewPost } from '../../../models/mongodb/SN_DB/home';

const db = require('../../../models');

class HomeServiceSN {
    setPost = (id: string, value: string, category: number, fontFamily: string, files: any) => {
        return new Promise(async (resolve, reject) => {
            try {
                // const ids_file: any = files.map((f: any) => f.metadata.id_file.toString());
                // console.log(ids_file, 'ids_file', value, fontFamily, id);
                // const res = await NewPost.create({
                //     id_user: id,
                //     content: {
                //         text: value,
                //         imageOrVideos: ids_file,
                //     },
                //     createdAt:
                // });
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
