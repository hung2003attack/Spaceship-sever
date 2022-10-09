import jwt from 'jsonwebtoken';
class JWTVERIFY {
    verifyToken = async (req: any, res: any, next: any) => {
        const authHeader = (await req.headers.notcall) || (await req.body.headers.notcall);
        console.log('authHeader', authHeader, req.headers);
        console.log('body', req.body);

        if (authHeader) {
            const token = authHeader && authHeader.split(' ')[1];
            console.log('hello', token);

            if (!token) {
                return res.status(401).json({ status: 0, message: "You're not authenticated!" });
            } else {
                try {
                    await jwt.verify(token, `${process.env.ACCESS_TOKEN_LOGIN}`, (err: any, user: any) => {
                        if (err) {
                            return res.status(403).json({ status: 0, message: 'Token is invalid' });
                        }

                        req.user = user;
                        console.log('verify454');

                        next();
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(403);
                }
            }
        } else {
            return res.status(401).json({ status: 0, message: "You're not authenticated!" });
        }
    };
    verifyTokenDelete = async (req: any, res: any, next: any) => {
        await this.verifyToken(req, res, () => {
            console.log('dằda');

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
