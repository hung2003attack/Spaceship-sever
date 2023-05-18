import { redisClient } from '../..';
import UserServiceSN from '../../services/WebsServices/UserServiceSN';
class userController {
    getById = async (req: any, res: any) => {
        try {
            const id: string = req.body.id;
            const key = id + 'getById';

            redisClient.get(key, async (err: any, data: string) => {
                if (err) console.log('get user failed', err);

                const user = JSON.parse(data);
                console.log(user);
                if (user) {
                    console.log('redis user here', user);
                    return res.status(200).json(user);
                } else {
                    const userData: any = await UserServiceSN.getById(id, req.body.params);
                    redisClient.set(key, JSON.stringify(userData.data));
                    console.log('user outside ');
                    if (userData.status === 1) return res.status(200).json(userData.data);
                    return res.status(500).json({ mess: 'Failed!', status: 0 });
                }
            });
        } catch (error) {
            console.log(error);
        }
    };
    getByName = async (req: any, res: any) => {
        try {
            const name: string = req.body.name;
            const data: any = await UserServiceSN.getByName(name, req.body.params);
            if (data.status === 1) return res.status(200).json(data.data);
            return res.status(500).json({ mess: 'Failed!' });
        } catch (error) {
            console.log(error);
        }
    };
    setLg = async (req: any, res: any) => {
        try {
            const id: string = req.body.id;
            const lg: string = req.body.lg;
            const data: any = await UserServiceSN.setLg(id, lg);
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
    };
    setAs = async (req: any, res: any) => {
        try {
            const ass: number = req.body.as;
            const id = req.cookies.k_user;
            console.log(ass, id, 'heeeee');
            const key = id + 'getById';
            const data: any = await UserServiceSN.setAs(ass, id);
            redisClient.set(key, JSON.stringify(''), (err: any, data: string) => {
                if (err) console.log('Set Value faild!', err);
            });
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
    };
}
export default new userController();
