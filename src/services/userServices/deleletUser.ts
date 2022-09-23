const db = require('../../models');
class Service {
    delete = (idUser: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.users.findOne({ where: { id: idUser }, raw: true });
                if (user) {
                    const checkDT = await db.tokens.destroy({ where: { id: user.idToken } });
                    const checkDU = await db.users.destroy({
                        where: { id: idUser },
                        raw: true,
                    });
                    console.log(checkDT, checkDU);
                    if (checkDT === 1 && checkDU === 1) {
                        resolve('Delete Successful!');
                    } else {
                        resolve('Delete Failed!');
                    }
                }
            } catch (err) {
                reject(err);
            }
        });
    };
}
export default new Service();
