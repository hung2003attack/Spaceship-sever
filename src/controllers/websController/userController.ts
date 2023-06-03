import { redisClient } from '../..';
import UserServiceSN from '../../services/WebsServices/UserServiceSN';
class userController {
    getById = async (req: any, res: any) => {
        try {
            const redisClients = req.redisClient;
            const id: string = req.cookies.k_user;
            const key: string = id + 'getById';
            const key_private: string = id + 'private';
            const browser_id = req.headers['user-agent'];
            let bros: any = '';
            let itemss: string[] = [];
            // key_private to use taking control key_values of user are havine in redis and when logout it will delete all but not warning_browser
            redisClients.lrange(key_private, 0, -1, (err: any, items: string[]) => {
                if (err) console.log(err);
                if (!items.includes(key))
                    redisClient.rpush(key_private, key, (err: any, length: number) => {
                        if (err) console.log(err);
                        console.log(`Item added to the list. New length: ${length}`);
                    });
            });
            redisClients.lrange(id + 'warning_browsers', 0, -1, (err: any, items: string[]) => {
                if (err) console.log(err);
                itemss = items;
                items?.forEach((item) => {
                    redisClients.get(item, (err: any, result: string) => {
                        if (err) console.log(err);
                        const dt = JSON.parse(result);
                        console.log('dt.prohibit', dt.prohibit);

                        if (dt.prohibit) bros = JSON.parse(result);
                    });
                });
            });

            redisClients.get(key, async (err: any, data: string) => {
                if (err) console.log('get user failed', err);
                const user = JSON.parse(data);
                console.log(user, bros, ' bros', itemss, ' itemss', data, 'data');
                if (bros && !itemss.includes(browser_id) && user) user.warning_browser = bros;
                if (user) {
                    console.log('redis user here', user);
                    return res.status(200).json(user);
                } else {
                    const userData: any = await UserServiceSN.getById(id, req.body.params);
                    redisClients.set(key, JSON.stringify(userData.data));
                    if (bros && !itemss.includes(browser_id)) userData.data.warning_browser = bros;
                    console.log('user outside ', userData, key);
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
            const key: string = id + 'getById';
            const data: any = await UserServiceSN.setAs(ass, id);
            redisClient.del(key, (err: any, data: string) => {
                if (err) console.log('del Value faild!', err);
            });
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
    };
    getNewMes = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            redisClient.get(`${id} user_message`, (err: any, rsu: string) => {
                if (err) console.log('get Value faild!', err);
                redisClient.get(`${id} message`, async (err: any, rsuls: string) => {
                    if (err) console.log(err);
                    if (JSON.parse(rsu)?.user.length > 0) {
                        const ys = JSON.parse(rsu);
                        ys.quantity = JSON.parse(rsuls)?.quantity;
                        console.log('redis 1');
                        return res.status(200).json(ys);
                    } else {
                        console.log('mysql 1');
                        const data: any = await UserServiceSN.getNewMes(id);
                        redisClient.set(`${id} user_message`, JSON.stringify(data));
                        data.quantity = JSON.parse(rsuls)?.quantity;
                        console.log('full', data);

                        return res.status(200).json(data);
                    }
                });
            });
        } catch (error) {
            console.log(error);
        }
    };
    delMessage = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            const redisClient = req.redisClient;
            redisClient.get(`${id} message`, (err: any, rs: string) => {
                if (err) console.log(err);
                if (rs && JSON.parse(rs).quantity > 0)
                    redisClient.set(`${id} message`, JSON.stringify({ quantity: 0 }));
            });
            return res.status(200).json({ ok: true });
        } catch (error) {
            console.log(error);
        }
    };
}
export default new userController();
