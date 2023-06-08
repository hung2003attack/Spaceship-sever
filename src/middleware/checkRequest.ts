import { redisClient } from '..';
import Token from '../services/TokensService/Token';

class CheckRequest {
    ip = (req: any, res: any, next: any) => {
        const ip_User = req.ip;
        redisClient.get(ip_User, (err: any, reply: string) => {
            if (err) {
                console.log('err Ip', err);
                return next();
            }

            // const count = Number(reply);
            // if (count > 40) {
            //     return res.status(200).json({ content: 'There are a lo. Please try again later.', status: 9999 });
            // }
            // redisClient.set(ip_User, count + 1);
            // redisClient.expire(ip_User, 60);
            next();
        });

        // redisClient.get()
    };
    changeName = (req: any, res: any, next: any) => {
        const id = req.cookies.k_user;
        const params = req.body.params.params;
        if (params.fullName) {
            redisClient.get(`${id} update Name`, (err: any, data: string) => {
                if (data) {
                    return res.status(200).json(data);
                } else {
                    next();
                }
            });
        } else {
            next();
        }
    };
}
export default new CheckRequest();
