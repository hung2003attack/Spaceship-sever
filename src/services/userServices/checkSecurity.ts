const db = require('../../models');
import bcrypt from 'bcryptjs';
const hash = bcrypt.genSaltSync(10);

class Security {
    checkUserEmail(email: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.users.findOne({ where: { phoneNumberEmail: email } });
                if (user) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (err) {
                reject(err);
            }
        });
    }
    password(password: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const hashPass = await bcrypt.hashSync(password, hash);

                resolve(hashPass);
            } catch (e) {
                reject(e);
            }
        });
    }
    checkIdToken(idUser: string) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('okoko');
                const id = await db.tokens.findOne({ where: { id: idUser }, raw: true });

                if (id) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}
export default new Security();
