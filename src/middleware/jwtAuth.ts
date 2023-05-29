import jwt from 'jsonwebtoken';
import token from '../services/TokensService/Token';
import { redisClient } from '..';
import moment from 'moment';
moment.locale('vi');
class JWTVERIFY {
    verifyToken = async (req: any, res: any, next: any) => {
        console.log(req.cookies);
        const browserId = req.headers['user-agent'];
        const idUser = req.cookies.k_user;
        const refreshToken = req.signedCookies.sn;
        const authHeader = req.cookies.tks;
        const io = res.io;
        const redisClients = req.redisClient;
        const dateTime = moment().format('HH:mm:ss DD-MM-YYYY');
        console.log(idUser, refreshToken, authHeader, req.cookies.tks, 'JWTVERIFY');

        if (authHeader && idUser && refreshToken) {
            const tokenc = authHeader && authHeader.split(' ')[1];
            if (!tokenc) {
                return res.status(401).json({ message: 'Unauthorized!' });
            } else {
                try {
                    await jwt.verify(tokenc, `${process.env.ACCESS_TOKEN_LOGIN}`, (err: any, user: any) => {
                        // user: {id:string;  iat: number; exp: number}
                        if (err || user.id !== idUser) {
                            token.deleteToken(res);
                            return res.status(404).json({ status: 0, message: 'Not Found' });
                        }

                        // redisClients.lrange(user.id + 'browserIds', 0, -1, (err: any, id_user_browsers: string[]) => {
                        //     if (err) console.log(err);
                        //     if (id_user_browsers.length === 0) {
                        //         return token.deleteToken(res);
                        //     } else {
                        //         id_user_browsers.forEach((browser_id) => {
                        //             if (!id_user_browsers.includes(browserId)) {
                        //                 redisClients.lrange(
                        //                     user.id + 'warning_browsers',
                        //                     0,
                        //                     -1,
                        //                     (err: any, items: string[]) => {
                        //                         if (err) console.log('lrang warning_browser', err);
                        //                         if (!items.includes(browserId)) {
                        //                             redisClients.rpush(
                        //                                 user.id + 'warning_browsers',
                        //                                 user.id + ':prohibit:' + browserId,
                        //                                 (err: any, length: number) => {
                        //                                     if (err) console.log('Redis', err);
                        //                                     console.log(
                        //                                         `1 Item has been added into the warning_browser! warning amount: ${length}`,
                        //                                     );
                        //                                     redisClients.expire(user.id + 'warning_browsers', 2592000);
                        //                                 },
                        //                             );
                        //                         }
                        //                     },
                        //                 );

                        //                 redisClients.set(
                        //                     user.id + ':prohibit:' + browserId,
                        //                     JSON.stringify({
                        //                         err: 9999,
                        //                         dateTime,
                        //                         prohibit: false,
                        //                     }),
                        //                 );
                        //                 const key = user.id + browser_id + 'browserId';
                        //                 io.emit(
                        //                     key,
                        //                     JSON.stringify({
                        //                         err: 9999,
                        //                         dateTime,
                        //                         prohibit: false,
                        //                     }),
                        //                 );
                        //             }
                        //         });
                        //     }
                        // });
                        next();
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(403);
                }
            }
        } else {
            token.deleteToken(res);
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
