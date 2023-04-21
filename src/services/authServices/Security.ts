const db = require('../../models');
import bcrypt from 'bcryptjs';
const hash = bcrypt.genSaltSync(10);

class Security {
    checkUserEmail(email: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.users.findOne({
                    where: { phoneNumberEmail: email },
                    attributes: ['id', 'phoneNumberEmail', 'password', 'avatar', 'fullName', 'gender'],
                    raw: true,
                });
                if (user) {
                    resolve({ status: true, user });
                } else {
                    resolve({ status: false });
                }
            } catch (err) {
                reject(err);
            }
        });
    }
    hash(data: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const hashPass = await bcrypt.hashSync(data, hash);
                resolve(hashPass);
            } catch (e) {
                reject(e);
            }
        });
    }
}
export default new Security();
