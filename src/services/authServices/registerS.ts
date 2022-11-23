import moment from 'moment';
const db = require('../../models');
import { v4 as primaryKey } from 'uuid';
import bcrypt from 'bcryptjs';

import UserIT from '../interface/inTerFaceUser';
import Security from './checkSecurity';
import fs from 'fs';
import 'moment/locale/vi';
import { VerifyMail, Prohibit } from '../../models/verify/sendOTPMail';
moment.locale('vi');
require('dotenv').config();

class register {
    add = async (data: UserIT) => {
        console.log('data', data);

        return new Promise(async (resolve, reject) => {
            if (data) {
                const checkPhoneNumberEmail = await db.users.findAll({
                    where: { phoneNumberEmail: data.phoneMail },
                    raw: true,
                });
                const checkPassword = checkPhoneNumberEmail.map((User: any) => {
                    const checkP = bcrypt.compareSync(data.password, User.password);
                    return checkP;
                });
                if (checkPhoneNumberEmail.length >= 5) {
                    resolve({ result: 'Create failed', check: 3 });
                    return;
                } else if (checkPassword.includes(true) === true) {
                    resolve({ result: 'Account is existed', check: 3 });
                    return;
                } else {
                    try {
                        const time = moment().get('hour') + ':' + moment().get('minute') + ':' + moment().get('second');
                        const date = moment().format('YYYY-MM-DD') + ' ' + time;
                        console.log(date, 'date');
                        const password = await Security.hash(data.password);
                        const res = await db.users.create({
                            id: primaryKey(),
                            fullName: data.name,
                            password: password,
                            phoneNumberEmail: data.phoneMail,
                            gender: data.gender,
                            birthDate: data.date,
                            admin: false,
                            createdAt: date,
                        });
                        if (res.dataValues.id) resolve({ result: 'ok, Created Successful', check: 1 });
                        resolve({ result: 'ok, Created Failed', check: 0 });
                    } catch (err) {
                        reject(err);
                    }
                }
            }
        });
    };
}

export default new register();
