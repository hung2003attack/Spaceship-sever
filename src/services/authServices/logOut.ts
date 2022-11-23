import token from '../tokensService/token';

const db = require('../../models');

class LogOut {
    logOut = (req: any, res: any) => {
        console.log('check-here', req.signedCookies, req.body.params.id);
        return new Promise(async (resolve, reject) => {
            try {
                console.log(res.cookies);
                if (req.signedCookies.sn && req.body.params.id) {
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
