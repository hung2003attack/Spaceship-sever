import bcrypt from 'bcryptjs';
const db = require('../../models');
import { v4 as primaryKey } from 'uuid';
import UserIT from '../interface/inTerFaceUser';
import UserSecurity from './checkSecurity';
require('dotenv').config();

class UserManipulation {
    addUser = async (data: UserIT) => {
        return new Promise(async (resolve, reject) => {
            if (data) {
                const checkPhoneNumberEmail = await db.users.findAll({
                    where: { phoneNumberEmail: data.phoneNumberEmail },
                    raw: true,
                });

                const checkPassword = checkPhoneNumberEmail.map((User: any) => {
                    const checkP = bcrypt.compareSync(data.password, User.password);
                    return checkP;
                });

                if (checkPhoneNumberEmail.length >= 3 || checkPassword.includes(true) === true) {
                    resolve({ result: '', check: false });
                    return;
                } else {
                    try {
                        const password = await UserSecurity.password(data.password);
                        db.users.create({
                            id: primaryKey(),
                            fullName: data.fullName,
                            password: password,
                            phoneNumberEmail: data.phoneNumberEmail,
                            gender: data.gender,
                            birthDate: data.birthDate,
                            idToken: primaryKey(),
                            admin: false,
                        });
                        resolve({ result: 'ok, Created Successful', check: true });
                    } catch (err) {
                        reject(err);
                    }
                }
            }
        });
    };
}

export default new UserManipulation();
