import jwt from 'jsonwebtoken';
import UserIT from '../interface/inTerFaceUser';
require('dotenv').config();
class Token {
    accessTokenF = (user: UserIT) => {
        return jwt.sign(user, '' + process.env.ACCESS_TOKEN_LOGIN + '', {
            expiresIn: '60s',
        });
    };
    refreshTokenF = (user: UserIT) => {
        console.log(`${process.env.REFRESH_TOKEN_SECRET}`);

        return jwt.sign(user, '' + process.env.REFRESH_TOKEN_SECRET + '', {});
    };
    deleteToken(res: { clearCookie: (arg0: string) => void }) {
        res.clearCookie('sn');
        res.clearCookie('tks');
        res.clearCookie('k_user');
    }
}
export default new Token();
