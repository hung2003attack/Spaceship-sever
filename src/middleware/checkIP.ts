import { redisClient } from '..';
import Token from '../services/TokensService/Token';

class CheckIP {
    requests = (req: any, res: any, next: any) => {
        const ip_User = req.ip;
        redisClient.get(ip_User, (err: any, reply: string) => {
            if (err) {
                console.log('err Ip', err);
                return next();
            }
            const count = Number(reply);
            if (count > 50) {
                return res
                    .status(200)
                    .json({ error: 'There are a lot of requests in a minute. Please try again later.', status: 9999 });
            }
            redisClient.set(ip_User, count + 1);
            redisClient.expire(ip_User, 60);
            next();
        });

        // redisClient.get()
    };
}
export default new CheckIP();
