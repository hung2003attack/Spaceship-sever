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
import { redisClient } from '../..';
moment.locale('vi');
require('dotenv').config();
class AuthServices {
    login = async (phoneNumberEmail: string, password: string, res: any) => {
        return new Promise(async (resolve, reject) => {
            try {
                const io = res.io;
                const userData: any = {};
                const isExist: any = await UserSecurity.checkUserEmail(phoneNumberEmail);
                const { status, user } = isExist;
                const dateTime = moment().format('HH:mm:ss DD-MM-YYYY');
                console.log('isExist', isExist);
                if (status && user.length > 0) {
                    user.map((u: any) => {
                        const checkP = bcrypt.compareSync(password, u.password);
                        if (checkP) {
                            delete u.password;
                            delete u.phoneNumberEmail;

                            // redisClient.set(u.id + 'primary', browserIdNow, (err: any, reply: any) => {
                            //     if (err) console.log(err);
                            //     console.log(reply);
                            // });
                            // redisClient.get(u.id + 'browserId', (err: any, id_browser: string) => {
                            //     if (err) console.log(err);
                            //     console.log(id_browser, ' id_browser here sss');
                            //     if (id_browser)
                            //         redisClient.lrange(
                            //             u.id + 'browserIds',
                            //             0,
                            //             -1,
                            //             (err: any, id_browsers: string[]) => {
                            //                 if (err) console.log(err);
                            //                 console.log(
                            //                     id_browsers.length === 0 || !id_browsers.includes(id_browser),
                            //                     'id_browsers.length === 0 || !id_browsers.includes(id_browser)',
                            //                     id_browser,
                            //                 );

                            //                 if (id_browsers.length === 0 || !id_browsers.includes(id_browser)) {
                            //                     redisClient.rpush(
                            //                         u.id + 'browserIds',
                            //                         id_browser,
                            //                         (err: any, length: number) => {
                            //                             if (err) {
                            //                                 console.log('Lỗi khi truy xuất Redis:', err);
                            //                                 return res.status(500);
                            //                             }
                            //                             console.log('add items browserIds', length);

                            //                             redisClient.expire(u.id + 'browserIds', 2592000);
                            //                         },
                            //                     );
                            //                     redisClient.lrange(
                            //                         u.id + 'browserIds',
                            //                         0,
                            //                         -1,
                            //                         (err: any, id_user_browsers: string[]) => {
                            //                             if (err) console.log(err);
                            //                             id_user_browsers.forEach((browser_id) => {
                            //                                 if (browser_id && browser_id !== browserIdNow) {
                            //                                     redisClient.lrange(
                            //                                         u.id + 'warning_browsers',
                            //                                         0,
                            //                                         -1,
                            //                                         (err: any, items: string[]) => {
                            //                                             if (err)
                            //                                                 console.log('lrang warning_browser', err);
                            //                                             if (!items.includes(browserIdNow)) {
                            //                                                 redisClient.rpush(
                            //                                                     u.id + 'warning_browsers',
                            //                                                     u.id + ':prohibit:' + browserIdNow,
                            //                                                     (err: any, length: number) => {
                            //                                                         if (err) console.log('Redis', err);
                            //                                                         console.log(
                            //                                                             `1 Item has been added into the warning_browser! warning amount: ${length}`,
                            //                                                         );
                            //                                                         redisClient.expire(
                            //                                                             u.id + 'warning_browsers',
                            //                                                             2592000,
                            //                                                         );
                            //                                                     },
                            //                                                 );
                            //                                             }
                            //                                         },
                            //                                     );
                            //                                     redisClient.set(
                            //                                         u.id + ':prohibit:' + browserIdNow,
                            //                                         JSON.stringify({
                            //                                             err: 9999,
                            //                                             dateTime,
                            //                                             prohibit: false,
                            //                                         }),
                            //                                     );

                            //                                     const key = u.id + browser_id + 'browserId';
                            //                                     io.emit(
                            //                                         key,
                            //                                         JSON.stringify({
                            //                                             err: 9999,
                            //                                             dateTime,
                            //                                             prohibit: false,
                            //                                         }),
                            //                                     );
                            //                                 }
                            //                             });
                            //                         },
                            //                     );
                            //                 }
                            //             },
                            //         );
                            // });
                            // redisClient.set(u.id + 'browserId', browserIdNow, (err: any, reply: any) => {
                            //     if (err) console.log(err);
                            //     console.log(reply);
                            // });

                            const accessToken = Token.accessTokenF(u);
                            const refreshToken = Token.refreshTokenF(u);

                            Object.freeze(u);
                            res.cookie('sn', refreshToken, {
                                signed: true,
                                httpOnly: true,
                                secure: false,
                                path: '/',
                                sameSite: 'strict',
                                expires: new Date(new Date().getTime() + 365 * 86409000),
                            });
                            userData.errCode = 1;
                            userData.data = { ...u, accessToken };
                        }
                    });
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
                if (checkPhoneNumberEmail.length >= 7) {
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
                        const res = await db.users.create(
                            {
                                id: primaryKey(),
                                fullName: data.name,
                                password: password,
                                phoneNumberEmail: data.phoneMail,
                                gender: data.gender,
                                birthday: data.date,
                                admin: false,
                                createdAt: date,
                            },
                            { raw: true },
                        );
                        console.log('ress add', res);

                        if (res.dataValues.id) {
                            const mores = await db.mores.create({
                                id_user: res.dataValues.id,
                                createdAt: date,
                            });
                            if (mores.dataValues.id_user) {
                                resolve({
                                    result: 'ok, Created Successful',
                                    check: 1,
                                    acc: checkPhoneNumberEmail.length + 1,
                                });
                            }
                        }
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
