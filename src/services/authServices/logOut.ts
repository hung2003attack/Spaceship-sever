import token from '../tokensService/token';

const db = require('../../models');

class LogOut {
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
}
export default new LogOut();
