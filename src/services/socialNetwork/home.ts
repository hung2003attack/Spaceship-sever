const db = require('../../models');

class homeSN {
    getUserShareNews = () => {
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
export default new homeSN();
