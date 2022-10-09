const db = require('../../models');
import bcrypt from 'bcryptjs';
import Token from '../tokens/token';
import UserSecurity from './checkSecurity';
require('dotenv').config();
class user {
    login = async (phoneNumberEmail: string, password: string, res: any) => {
        return new Promise(async (resolve, reject) => {
            try {
                const userData: any = {};
                const isExist = await UserSecurity.checkUserEmail(phoneNumberEmail);
                if (isExist) {
                    const user = await db.users.findOne({
                        where: { phoneNumberEmail: phoneNumberEmail },
                        raw: true,
                    });

                    if (user) {
                        const checkP = bcrypt.compareSync(password, user.password);
                        if (checkP) {
                            delete user.password;
                            delete user.phoneNumberEmail;

                            userData.errCode = 0;
                            const accessToken = await Token.accessTokenF(user);
                            const refreshToken = await Token.refreshTokenF(user);

                            const checkIdToken = await UserSecurity.checkIdToken(user.idToken);

                            if (!checkIdToken) {
                                await db.tokens.create({
                                    id: user.idToken,
                                    accessToken: refreshToken,
                                });
                            } else {
                                await db.tokens.update({ accessToken: refreshToken }, { where: { id: user.idToken } });
                            }
                            var now = new Date();
                            now.setTime(now.getTime() + 1 * 3600 * 1000);
                            res.cookie('sn', refreshToken, {
                                signed: true,
                                httpOnly: true,
                                secure: false,
                                path: '/',
                                sameSite: 'strict',
                                expires: new Date(new Date().getTime() + 365 * 86409000),
                            });
                            userData.data = { ...user, accessToken };
                        } else {
                            userData.errCode = 1;
                            userData.errMessage = 'wrong account or password!';
                        }
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'wrong account or password!';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'wrong account or password!';
                }
                resolve(userData);
            } catch (err) {
                reject(err);
            }
        });
    };
}
export default new user();
