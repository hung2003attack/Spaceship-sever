import moment from 'moment';
import { redisClient } from '../..';
import UserServiceSN from '../../services/WebsServices/UserServiceSN';
class userController {
    getById = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            const id_req: string = req.body.id;
            const mores = req.body.mores;
            const first = req.body.first;
            const userData: any = await UserServiceSN.getById(id, id_req, req.body.params, mores, first);
            console.log(userData);
            if (userData.status === 1) return res.status(200).json(userData.data);
            return res.status(500).json({ mess: 'Failed!', status: 0 });
        } catch (error) {
            console.log(error);
        }
    };
    getByName = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            const name: string = req.body.name;
            const data: any = await UserServiceSN.getByName(id, name, req.body.params);
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
    changesOne = async (req: any, res: any) => {
        try {
            const dateTime = moment().format('HH:mm:ss DD-MM-YYYY');
            const id = req.body.params.id;
            const id_req = req.cookies.k_user;
            const params = req.body.params.params;
            const value = req.body.params.value;
            const redisClient = req.redisClient;
            console.log(id, 'heeeee', params);
            if (params.fullName) {
                const fullName = `${id} update Name`;
                redisClient.get(fullName, async (err: any, data: string) => {
                    if (err) console.log(err);
                    if (!data) {
                        const data: any = await UserServiceSN.changesOne(id, id_req, value, params);
                        console.log('data full name', data);

                        if (data === 1) {
                            redisClient.set(fullName, dateTime);
                            redisClient.expire(fullName, 2592000);
                        }
                        return res.status(200).json(data);
                    } else {
                        return res.status(200).json(false);
                    }
                });
            } else if (params.nickName) {
                const nickName = `${id} update Nick Name`;
                redisClient.get(nickName, async (err: any, datas: string) => {
                    if (err) console.log(err);
                    const data: any = await UserServiceSN.changesOne(id, id_req, value, params);
                    console.log('data nick name', data);

                    if (datas) {
                        const ds = JSON.parse(datas);
                        ds.push(dateTime);
                        redisClient.set(nickName, JSON.stringify(ds));
                    } else {
                        redisClient.set(nickName, JSON.stringify([dateTime]));
                    }
                    redisClient.expire(nickName, 2592000);
                    return res.status(200).json(data);
                });
            } else {
                const data: any = await UserServiceSN.changesOne(id, id_req, value, params);
                return res.status(200).json(data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    follow = async (req: any, res: any) => {
        try {
            const id_fl = req.cookies.k_user;
            const id = req.body.params.id;
            const follow = req.body.params.follow;
            const data = await UserServiceSN.follow(id, id_fl, follow);
            console.log(data, 'nooo');

            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
    };
    Unfollow = async (req: any, res: any) => {
        try {
            const id_fl = req.cookies.k_user;
            const id = req.body.params.id;
            const Unfollow = req.body.params.unfollow;
            const data = await UserServiceSN.Unfollow(id, id_fl, Unfollow);
            console.log(data, 'contr');
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
    };
    getMore = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            const limit = req.query.limit;
            const offset = req.query.offset;
            const data = await UserServiceSN.getMore(id, Number(offset), Number(limit));
            console.log(data, 'more');
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
    };
}
export default new userController();
