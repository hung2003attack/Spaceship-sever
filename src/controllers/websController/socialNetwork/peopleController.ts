import { redisClient } from '../../..';
import peopleServiceSN from '../../../services/WebsServices/peopleServiceSN';

class peopleController {
    getPeopleAll = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            const key: string = id + 'people';
            const key_private: string = id + 'private';

            redisClient.get(key, async (err: any, data: string) => {
                console.log(JSON.stringify(data), 'ere');
                if (err) console.log('get value faild!', err);
                const people = JSON.parse(data);
                if (people) {
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
            const title: string = req.body.params.title;
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
            const data: any = await peopleServiceSN.setFriend(id, id_friend, title);
            if (data.id_friend) io.emit(`Request others?id=${data.id_friend}`, JSON.stringify(data));

            return res.status(200).json(data);
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
    getFriendAll = async (req: any, res: any) => {
        try {
            const id: string = req.cookies.k_user;
            const data = await peopleServiceSN.getFriendAll(id);
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
            const data: any = await peopleServiceSN.delete(id, id_req, kindOf);
            console.log(data, 'delete');

            if (data) {
                if (data.idFriend)
                    io.emit(
                        `Del request others?id=${data.idFriend}`,
                        JSON.stringify({
                            data: {
                                id: 106,
                                idCurrentUser: data.idCurrentUser,
                                idFriend: null,
                                id_message: null,
                                createdAt: null,
                            },
                        }),
                    );
                redisClient.del(id + 'people', (err: any) => {
                    if (err) console.log('Del Value faild!', err);
                });
                redisClient.del(id_req + 'people', (err: any) => {
                    if (err) console.log('Del Value faild!', err);
                    io.emit(`Delete request friends or relatives${id_req}`);
                });
            }
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
            console.log('vo', kindOf, id);
            const data: { ok: number; id_fr: string; id: string } | any = await peopleServiceSN.setConfirm(
                id,
                id_fr,
                kindOf,
            );
            if (data.ok === 1) io.emit(`Confirmed ${data.id_fr}`, JSON.stringify(data));
            return res.status(200).json(data);
        } catch (error) {
            console.log(error, 'setConfrim');
        }
    };
}
export default new peopleController();
