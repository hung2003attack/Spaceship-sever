import jwt from 'jsonwebtoken';
import token from '../services/TokensService/Token';
class JWTVERIFY {
    verifyToken = async (req: any, res: any, next: any) => {
        console.log(req.cookies);

        const idUser = req.cookies.k_user;
        const refreshToken = req.signedCookies.sn;
        const authHeader = req.cookies.tks;
        console.log(idUser, refreshToken, authHeader, req.cookies.tks, 'JWTVERIFY');

        if (authHeader && idUser && refreshToken) {
            const tokenc = authHeader && authHeader.split(' ')[1];
            if (!tokenc) {
                return res.status(401).json({ message: 'Unauthorized!' });
            } else {
                try {
                    await jwt.verify(tokenc, `${process.env.ACCESS_TOKEN_LOGIN}`, (err: any, user: any) => {
                        if (err || user.id !== idUser) {
                            token.deleteToken(res);
                            return res.status(403).json({ status: 0, message: 'Forbidden' });
                        }
                        req.user = user;
                        next();
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(403);
                }
            }
        } else {
            return res.status(401).json({ status: 0, message: "You're not11 authenticated!" });
        }
    };
    verifyTokenDelete = async (req: any, res: any, next: any) => {
        await this.verifyToken(req, res, () => {
            console.log('a', req.user.id, req.params.id, 'req.body.id', req.body.id);
            console.log('b', req.user, req.params);
            if (req.user.id === req.body.id || req.user.admin === req.params.admin) {
                next();
            } else {
                return res.status(401).json({ status: 0, message: "Your're not allowed to  DELETE other" });
            }
        });
    };
}
export default new JWTVERIFY();
