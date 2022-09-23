import Token from './token';
import jwt from 'jsonwebtoken';
const db = require('../../models');
import upDateTime from '../../DateTimeCurrent/DateTimeCurrent';
require('dotenv').config();
class RefreshTokenCookie {
    refreshToken = async (req: any, res: any) => {
        const refreshToken = req.cookies.fr;

        if (!refreshToken) return res.status(403).json("You're not Authenticated");
        const refreshTokenDB = await db.tokens.findOne({
            where: { accessToken: refreshToken },
            raw: true,
        });
        if (!refreshTokenDB) return res.status(403).json('Refresh token invalid!');
        jwt.verify(refreshToken, '' + process.env.REFRESH_TOKEN_SECRET + '', (err: any, user: any) => {
            if (err) {
                console.log('err here');
                return console.log(err);
            }
            delete user.iat;
            const newAccessToken = Token.accessTokenF(user);
            const newRefreshToken = Token.refreshTokenF(user);
            const date = new Date();
            //  user.exp = date.getTime() / 1000 + 60;
            if (newRefreshToken) {
                db.tokens.update({ accessToken: newRefreshToken }, { where: { id: user.idToken } });
            }
            console.log(user);

            res.cookie('fr', newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });
            user.accessToken = newAccessToken;

            res.status(200).json({ newAccessToken: newAccessToken });
        });
    };
}
export default new RefreshTokenCookie();
