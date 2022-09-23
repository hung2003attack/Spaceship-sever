const db = require('../../models');

class LogOut {
    logOut = (req: any, res: any) => {
        return new Promise(async (resolve, reject) => {
            try {
                res.clearCookie('fr');
                if (req.cookies.fr) {
                    const check = await db.tokens.destroy({ where: { accessToken: req.cookies.fr } });
                    if (check) resolve('Logged out !');
                    console.log(check);
                } else {
                    resolve('no exist !');
                }
            } catch (error) {
                reject(error);
            }
        });
    };
}
export default new LogOut();
