import jwt from 'jsonwebtoken';
import UserIT from '../interface/inTerFaceUser';
require('dotenv').config();
class Token {
    accessTokenF = (user: UserIT) => {
        try {
            return jwt.sign(user, '' + process.env.ACCESS_TOKEN_LOGIN + '', {
                expiresIn: '2d',
            });
        } catch (err) {
            console.log(err, 'accessToken');
        }
    };
    refreshTokenF = (user: UserIT) => {
        console.log(`${process.env.REFRESH_TOKEN_SECRET}`);
        try {
            return jwt.sign(user, '' + process.env.REFRESH_TOKEN_SECRET + '', {});
        } catch (error) {
            console.log(error, 'reFreshToken');
        }
    };
    deleteToken(res: {
        clearCookie: (arg0: string) => void;
        status: (arg0: number) => {
            (): any;
            new (): any;
            json: { (arg0: { status: number; message: string }): any; new (): any };
        };
    }) {
        console.log('delete coookies');

        res.clearCookie('sn');
        res.clearCookie('tks');
        res.clearCookie('k_user');
    }
}
export default new Token();
