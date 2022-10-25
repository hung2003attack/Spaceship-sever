import bcrypt from 'bcryptjs';
import moment from 'moment';
const db = require('../../models');
import { v4 as primaryKey } from 'uuid';
import UserIT from '../interface/inTerFaceUser';
import UserSecurity from './checkSecurity';
import 'moment/locale/vi';
moment.locale('vi');
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
                    resolve({ result: 'Creation Failed', check: 3 });
                    return;
                } else {
                    try {
                        const time =
                            moment().get('hour') + 7 + ':' + moment().get('minute') + ':' + moment().get('second');
                        const date = moment().format('YYYY-MM-DD') + ' ' + time;
                        console.log(date, 'date');

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
                            createdAt: date,
                        });
                        resolve({ result: 'ok, Created Successful', check: 1 });
                    } catch (err) {
                        reject(err);
                    }
                }
            }
        });
    };
}

export default new UserManipulation();
