import Token from './Token';
import jwt from 'jsonwebtoken';
import token from './Token';
require('dotenv').config();
class RefreshTokenCookie {
    refreshToken = async (req: any, res: any) => {
        const refreshToken = req.signedCookies.sn;
        const idUser = req.cookies.k_user;
        const accessToken = req.cookies.tks;
        if (!refreshToken || !idUser || !accessToken) {
            token.deleteToken(res);
            return res.status(403).json("You're not Authenticated");
        }
        jwt.verify(refreshToken, '' + process.env.REFRESH_TOKEN_SECRET + '', (err: any, user: any) => {
            if (err || idUser !== user.id) {
                token.deleteToken(res);
                return res.status(403).json({ status: 0, message: "You're not Authenticated" });
            }
            delete user.iat;
            const newAccessToken = Token.accessTokenF(user);
            const newRefreshToken = Token.refreshTokenF(user);

            res.cookie('sn', newRefreshToken, {
                signed: true,
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
                expires: new Date(new Date().getTime() + 365 * 86409000),
            });
            return res.status(200).json({ newAccessToken: newAccessToken });
        });
    };
}
export default new RefreshTokenCookie();
