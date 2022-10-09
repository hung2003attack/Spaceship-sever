const db = require('../../models');

class LogOut {
    logOut = (req: any, res: any) => {
        console.log('check-here', req.signedCookies);
        return new Promise(async (resolve, reject) => {
            try {
                res.clearCookie('sn');
                res.clearCookie('tks');

                if (req.signedCookies.sn) {
                    const check = await db.tokens.destroy({ where: { accessToken: req.signedCookies.sn } });
                    if (check) resolve({ status: 1, message: 'Logged out !' });
                } else {
                    resolve({ status: 0, message: 'no exist !' });
                }
            } catch (error) {
                reject(error);
            }
        });
    };
}
export default new LogOut();
