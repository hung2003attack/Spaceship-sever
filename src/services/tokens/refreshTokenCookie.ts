import Token from './token';
import jwt from 'jsonwebtoken';
const db = require('../../models');
import upDateTime from '../../DateTimeCurrent/DateTimeCurrent';
require('dotenv').config();
class RefreshTokenCookie {
    refreshToken = async (req: any, res: any) => {
        const refreshToken = req.signedCookies.sn;
        console.log('1asdhoawihfwoiah', refreshToken);

        if (!refreshToken) return res.status(403).json("You're not Authenticated");
        const refreshTokenDB = await db.tokens.findOne({
            where: { accessToken: refreshToken },
            raw: true,
        });
        if (!refreshTokenDB) return res.status(403).json('Refresh token invalid!');
        console.log('222asdhoawihfwoiah', refreshTokenDB);

        jwt.verify(refreshToken, '' + process.env.REFRESH_TOKEN_SECRET + '', (err: any, user: any) => {
            if (err) {
                console.log('err here');
                return console.log(err);
            }
            console.log('222asdhoawihfwoiah');

            delete user.iat;
            const newAccessToken = Token.accessTokenF(user);
            const newRefreshToken = Token.refreshTokenF(user);
            const date = new Date();
            //  user.exp = date.getTime() / 1000 + 60;
            if (newRefreshToken) {
                db.tokens.update({ accessToken: newRefreshToken }, { where: { id: user.idToken } });
            }
            console.log(user);

            res.cookie('sn', newRefreshToken, {
                signed: true,
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
                expires: new Date(new Date().getTime() + 365 * 86409000),
            });
            user.accessToken = newAccessToken;
            console.log('yep');

            res.status(200).json({ newAccessToken: newAccessToken });
        });
    };
}
export default new RefreshTokenCookie();
