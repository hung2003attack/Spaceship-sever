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
}
export default new Token();
