import { redisClient } from '../../..';
import peopleServiceSN from '../../../services/WebsServices/peopleServiceSN';

class peopleController {
    getPeopleAll = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            const key: string = id + 'people';
            const key_private = id + 'private';

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
            const id_friend = req.body.params.id_friend;
            const key_user = id + 'people';
            const key_friend = id_friend + 'people';

            redisClient.del(key_user, (err: any, data: string) => {
                if (err) console.log('Set Value faild!', err);
            });
            redisClient.del(key_friend, (err: any, data: string) => {
                if (err) console.log('Set Value faild!', err);
            });
            const data = await peopleServiceSN.setFriend(id, id_friend, title);
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
    };
    setRequest = async (req: any, res: any) => {
        const id: string = req.cookies.k_user;
        const id_friend = req.body.params.id_friend;
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
}
export default new peopleController();
