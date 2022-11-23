const db = require('../../models');
import bcrypt from 'bcryptjs';
import Token from '../tokensService/token';
import UserSecurity from './checkSecurity';

class user {
    login = async (phoneNumberEmail: string, password: string, res: any) => {
        return new Promise(async (resolve, reject) => {
            try {
                const userData: any = {};
                const isExist: any = await UserSecurity.checkUserEmail(phoneNumberEmail);
                const { status, user } = isExist;
                console.log('isExist', isExist);
                if (status && user) {
                    const checkP = bcrypt.compareSync(password, user.password);
                    console.log('p');

                    if (checkP) {
                        console.log('s');

                        delete user.password;
                        delete user.phoneNumberEmail;
                        userData.errCode = 0;
                        const accessToken = await Token.accessTokenF(user);
                        const refreshToken = await Token.refreshTokenF(user);
                        Object.freeze(user);
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
                        userData.errCode = 3;
                    }
                } else {
                    userData.errCode = 3;
                }
                resolve(userData);
            } catch (err) {
                reject(err);
            }
        });
    };
}
export default new user();
