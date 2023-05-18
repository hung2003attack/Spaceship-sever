import moment from 'moment';
import { v4 as primaryKey } from 'uuid';
import bcrypt from 'bcryptjs';
import 'moment/locale/vi';

const db = require('../../models');
import Token from '../TokensService/Token';
import Security from './Security';
import UserSecurity from './Security';
import UserIT from '../interface/inTerFaceUser';
import token from '../TokensService/Token';
moment.locale('vi');
require('dotenv').config();
class AuthServices {
    login = async (phoneNumberEmail: string, password: string, res: any) => {
        return new Promise(async (resolve, reject) => {
            try {
                const userData: any = {};
                const isExist: any = await UserSecurity.checkUserEmail(phoneNumberEmail);
                const { status, user } = isExist;
                console.log('isExist', isExist);
                if (status && user.length > 0) {
                    user.map(async (u: any) => {
                        const checkP = bcrypt.compareSync(password, u.password);
                        if (checkP) {
                            delete user.password;
                            delete user.phoneNumberEmail;
                            userData.errCode = 1;
                            const accessToken = await Token.accessTokenF(u);
                            const refreshToken = await Token.refreshTokenF(u);
                            Object.freeze(u);
                            res.cookie('sn', refreshToken, {
                                signed: true,
                                httpOnly: true,
                                secure: false,
                                path: '/',
                                sameSite: 'strict',
                                expires: new Date(new Date().getTime() + 365 * 86409000),
                            });
                            userData.data = { ...u, accessToken };
                        } else {
                            userData.errCode = 0;
                        }
                    });
                } else {
                    userData.errCode = 0;
                }
                resolve(userData);
            } catch (err) {
                reject(err);
            }
        });
    };
    logOut = (req: any, res: any) => {
        console.log('check-here', req.signedCookies, req.cookies.k_user);
        return new Promise(async (resolve, reject) => {
            try {
                const refreshToken = req.signedCookies.sn;
                const accessToken = req.cookies.tks;
                const id = req.cookies.k_user;
                console.log(req.cookies, '123456');
                if (refreshToken && accessToken && id) {
                    token.deleteToken(res);
                    resolve({ status: 1, message: 'Logged out !' });
                } else {
                    resolve({ status: 0, message: 'unauthorized !' });
                }
            } catch (error) {
                reject(error);
            }
        });
    };
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
                if (checkPhoneNumberEmail.length >= 2) {
                    resolve({ result: 'Create failed', check: 2, acc: checkPhoneNumberEmail.length });
                    return;
                } else if (checkPassword.includes(true) === true) {
                    resolve({ result: 'Account is existed', check: 2, acc: checkPhoneNumberEmail.length });
                    return;
                } else {
                    try {
                        const date = moment().format('YYYY-MM-DD HH:mm:ss');
                        console.log(date, 'date');
                        const password = await Security.hash(data.password);
                        const res = await db.users.create({
                            id: primaryKey(),
                            fullName: data.name,
                            password: password,
                            phoneNumberEmail: data.phoneMail,
                            gender: data.gender,
                            birthday: data.date,
                            admin: false,
                            createdAt: date,
                        });
                        if (res.dataValues.id)
                            resolve({
                                result: 'ok, Created Successful',
                                check: 1,
                                acc: checkPhoneNumberEmail.length,
                            });
                        resolve({ result: 'ok, Created Failed', check: 0, acc: checkPhoneNumberEmail.length });
                    } catch (err) {
                        reject(err);
                    }
                }
            }
        });
    };
}
export default new AuthServices();
