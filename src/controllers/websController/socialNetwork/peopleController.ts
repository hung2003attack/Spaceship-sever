import { redisClient } from '../../..';
import peopleServiceSN from '../../../services/WebsServices/peopleServiceSN';

class peopleController {
    getPeopleAll = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            const key: string = id + 'people';
            const key_private: string = id + 'private';
            const rl = req.query.rl;
            console.log('params', req.query);

            redisClient.get(key, async (err: any, data: string) => {
                if (err) console.log('get value faild!', err);
                const people = JSON.parse(data);
                if (people && rl !== 'yes') {
                    console.log(people);
                    return res.status(200).json(people);
                } else {
                    const datas = await peopleServiceSN.getPeopleAll(id);
                    console.log('yess,da', datas);
                    redisClient.set(key, JSON.stringify(datas));
                    redisClient.lrange(key_private, 0, -1, (err: any, items: string[]) => {
                        if (err) console.log(err);
                        if (!items.includes(key))
                            redisClient.rpush(key_private, key, (err: any, length: number) => {
                                if (err) console.log(err);
                                console.log(`Item added to the list. New length: ${length}`);
                            });
                    });

                    return res.status(200).json(datas);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };
    setFriend = async (req: any, res: any) => {
        try {
            const id: string = req.cookies.k_user;
            const id_friend: string = req.body.params.id_friend;
            const key_user: string = id + 'people';
            const key_friend: string = id_friend + 'people';
            const io = res.io;
            redisClient.del(key_user, (err: any, data: string) => {
                if (err) console.log('Del Value faild!', err);
            });
            redisClient.del(key_friend, (err: any, data: string) => {
                if (err) console.log('Del Value faild!', err);
            });
            const data: any = await peopleServiceSN.setFriend(id, id_friend);

            redisClient.get(`${data.id_friend} message`, (err: any, rs: string) => {
                if (err) console.log(err);
                if (data && JSON.parse(rs)) {
                    redisClient.set(
                        `${data.id_friend} message`,
                        JSON.stringify({ quantity: JSON.parse(rs).quantity + 1 }),
                    );
                } else {
                    redisClient.set(`${data.id_friend} message`, JSON.stringify({ quantity: 1 }));
                }
                redisClient.get(`${data.id_friend} message`, (err: any, rs: string) => {
                    if (err) console.log(err);
                    if (JSON.parse(rs).quantity > 0) data.quantity = JSON.parse(rs).quantity;
                    io.emit(`Request others?id=${data.id_friend}`, JSON.stringify(data));
                });
                redisClient.del(`${data.id_friend} user_message`);
                return res.status(200).json(data);
            });
        } catch (error) {
            console.log(error);
        }
    };
    setRequest = async (req: any, res: any) => {
        const id: string = req.cookies.k_user;
        const id_friend: string = req.body.params.id_friend;
        console.log('id_friend', id_friend);
        const data = await peopleServiceSN.setRequest(id, id_friend);
    };
    getFriends = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            const offset = req.query.offset;
            const limit = req.query.limit;
            const type = req.query.type;
            const key = id + type + 'getFriends';
            const key_private: string = id + 'private';

            redisClient.get(key, async (err: any, result: string) => {
                if (err) console.log(err);
                if (result) {
                    console.log('redis 5');

                    return res.status(200).json(JSON.parse(result));
                } else {
                    console.log('mysql 5');

                    const data = await peopleServiceSN.getFriends(id, Number(offset), Number(limit), type);
                    redisClient.set(key, JSON.stringify(data));
                    return res.status(200).json(data);
                }
            });
            redisClient.lrange(key_private, 0, -1, (err: any, items: string[]) => {
                if (err) console.log(err);
                if (!items.includes(key))
                    redisClient.rpush(key_private, key, (err: any, length: number) => {
                        if (err) console.log(err);
                        console.log(`Item added to the list. New length: ${length}`);
                    });
            });
        } catch (error) {
            console.log(error, 'getFriendAll');
        }
    };
    delete = async (req: any, res: any) => {
        try {
            const id: string = req.cookies.k_user;
            const id_req = req.body.params.id_req;
            const kindOf = req.body.params.kindOf;
            const redisClient = req.redisClient;
            const io = res.io;
            const data: any = await peopleServiceSN.delete(id, id_req, kindOf);
            console.log(data, 'delete', 'id_req', id_req);

            if (data) {
                if (data.idFriend)
                    io.emit(
                        `Del request others?id=${data.idFriend}`,
                        JSON.stringify({
                            data: {
                                id: 106,
                                idCurrentUser: data.idCurrentUser,
                                idFriend: null,
                                createdAt: null,
                            },
                        }),
                    );
                io.emit(
                    `Del request others?id=${data.idCurrentUser}`,
                    JSON.stringify({
                        data: {
                            id: 106,
                            idCurrentUser: data.idFriend,
                            idFriend: null,
                            createdAt: null,
                        },
                    }),
                );
                redisClient.get(`${data.idFriend} message`, (err: any, rs: string) => {
                    if (err) console.log(err);
                    if (data && rs && JSON.parse(rs).quantity > 0) {
                        redisClient.set(
                            `${data.idFriend} message`,
                            JSON.stringify({ quantity: JSON.parse(rs).quantity - 1 }),
                        );
                    }
                });
                redisClient.del(id + 'people', (err: any) => {
                    if (err) console.log('Del Value faild!', err);
                });
                redisClient.del(id_req + 'people', (err: any) => {
                    if (err) console.log('Del Value faild!', err);
                    io.emit(`Delete request friends or relatives${data.idFriend}`, data.idCurrentUser);
                });
            }
            redisClient.get(`${data.idFriend} message`, (err: any, rs: string) => {
                if (err) console.log(err);
                if (rs) data.quantity = JSON.parse(rs).quantity;
            });
            redisClient.del(`${data.idFriend} user_message`, (err: any) => {
                if (err) console.log('Del Value faild!', err);
            });
            return res.status(200).json(data);
        } catch (error) {
            console.log(error, 'delete Request');
        }
    };
    setConfirm = async (req: any, res: any) => {
        try {
            const id: string = req.cookies.k_user;
            const kindOf = req.body.params.kindOf;
            const id_fr = req.body.params.id_req;
            const io = res.io;
            const atInfo = req.body.params.atInfor;
            console.log('vo', atInfo);
            const data: { ok: number; id_fr: string; id: string } | any = await peopleServiceSN.setConfirm(
                id,
                id_fr,
                kindOf,
            );
            if (data.ok === 1 && atInfo) {
                io.emit(`Confirmed atInfo ${data.id}`, JSON.stringify({ ok: 1, id_fr: data.id, id: data.id_fr }));
            }

            if (data.ok === 1) io.emit(`Confirmed ${data.id_fr}`, JSON.stringify(data));
            redisClient.del(`${data.id_fr} user_message`);
            return res.status(200).json(data);
        } catch (error) {
            console.log(error, 'setConfrim');
        }
    };
    getStrangers = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            const offset = req.query.offset;
            const limit = req.query.limit;
            console.log('offset herer', offset, limit);
            const data: any = await peopleServiceSN.getStrangers(id, Number(offset), Number(limit));
            console.log('mysql 6');
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
    };
}
export default new peopleController();
