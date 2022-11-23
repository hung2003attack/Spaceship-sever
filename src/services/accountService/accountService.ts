const db = require('../../models');

class Account {
    get(phoneMail: string | number) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.users.findAll({
                    where: { phoneNumberEmail: phoneMail },
                    attributes: ['id', 'fullName', 'nickName', 'avatar', 'gender'],
                    raw: true,
                });
                if (user.length > 0) {
                    resolve({ user, status: 1 });
                } else {
                    reject({ status: 0 });
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    delete(idUser: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.users.findOne({ where: { id: idUser }, raw: true });
                if (user) {
                    const checkDT = await db.tokens.destroy({ where: { id: idUser } });
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
    }
}
export default new Account();
