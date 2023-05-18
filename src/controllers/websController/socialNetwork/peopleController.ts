import { redisClient } from '../../..';
import peopleServiceSN from '../../../services/WebsServices/peopleServiceSN';

class peopleController {
    getPeopleAll = async (req: any, res: any) => {
        try {
            const id = req.cookies.k_user;
            const key: string = id + 'people';
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
            const key = id + 'people';
            redisClient.set(key, JSON.stringify(''), (err: any, data: string) => {
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
