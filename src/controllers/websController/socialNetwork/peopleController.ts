import { redisClient } from '../../..';
import peopleServiceSN from '../../../services/WebsServices/SocialNetwork/peopleServiceSN';

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
            const per = req.body.params.per;
            const data: any = await peopleServiceSN.setFriend(id, id_friend, per);

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
            console.log('type', type);

            const data = await peopleServiceSN.getFriends(id, Number(offset), Number(limit), type);
            return res.status(200).json(data);
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
            const per = req.body.params.per;
            const data: any = await peopleServiceSN.delete(id, id_req, kindOf, per);
            console.log(data, 'delete', 'id_req', id_req);

            if (data) {
                if (data.ok?.idFriend)
                    io.emit(
                        `Del request others?id=${data.ok?.idFriend}`,
                        JSON.stringify({
                            data: {
                                id: 106,
                                idCurrentUser: data.ok?.idCurrentUser,
                                idFriend: null,
                                createdAt: null,
                            },
                        }),
                    );
                io.emit(
                    `Del request others?id=${data.ok?.idCurrentUser}`,
                    JSON.stringify({
                        data: {
                            id: 106,
                            idCurrentUser: data.ok?.idFriend,
                            idFriend: null,
                            createdAt: null,
                        },
                    }),
                );
                redisClient.get(`${data.ok?.idFriend} message`, (err: any, rs: string) => {
                    if (err) console.log(err);
                    if (data && rs && JSON.parse(rs).quantity > 0) {
                        redisClient.set(
                            `${data.ok?.idFriend} message`,
                            JSON.stringify({ quantity: JSON.parse(rs).quantity - 1 }),
                        );
                    }
                });
            }
            redisClient.get(`${data.ok?.idFriend} message`, (err: any, rs: string) => {
                if (err) console.log(err);
                if (rs) data.ok.quantity = JSON.parse(rs).quantity;
            });
            redisClient.del(`${data.ok?.idFriend} user_message`, (err: any) => {
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
            const limit = req.query.limit;
            const ids = req.query.ids;
            const data: any = await peopleServiceSN.getStrangers(id, Number(limit), ids);
            console.log('mysql 6');
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
    };
}
export default new peopleController();
