import moment from 'moment';
import { io } from '../..';
import { v4 as primaryKey } from 'uuid';
moment.locale('vi');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../../models');

class PeopleService {
    getStranger(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                // let tracks = await db.tracks.findAll({
                //     include: [db.user],
                //     group: 'friends.idCurrentUser',
                //     attributes: {
                //         include: [
                //             {
                //                 model: db.users,
                //                 where: {
                //                     id: ['UUID1', 'UUID2'],
                //                 },
                //                 having: ['COUNT(DISTINCT moodsTracks.uuid) = 2'],
                //             },
                //         ],
                //     },
                // });
                const friends = await db.friends
                    .findAll({
                        where: { idCurrentUser: id },
                        attributes: ['idFriend'],
                        raw: true,
                    })
                    .then((fr: { idFriend: string }[]) => fr.map((f) => f.idFriend));
                const relatives = await db.relative
                    .findAll({
                        where: { id_user: id },
                        attributes: ['id_relative'],
                        raw: true,
                    })
                    .then((rel: { id_relative: string }[]) => rel.map((r) => r.id_relative));
                friends.push(id);
                const all = friends.concat(relatives);
                console.log(friends, '--', relatives, ' == ', all);
                const data = await db.users.findAll({
                    where: { id: { [Op.notIn]: all } },
                    attributes: ['id', 'fullName', 'nickName', 'gender', 'birthday'],
                    raw: true,
                });
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
    setFriend(id: string, id_friend: string, title: string) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('data here');
                const date = moment().format('YYYY-MM-DD HH:mm:ss');
                console.log(date, 'date');
                const dataFs = await db.friends.findOne({
                    where: { idCurrentUser: id, idFriend: id_friend },
                    raw: true,
                });
                if (!dataFs) {
                    const id_mess = primaryKey();
                    if (id_mess) {
                        const data = await db.friends.create(
                            { idCurrentUser: id, idFriend: id_friend, id_message: id_mess, createdAt: date },
                            { raw: true },
                        );
                        if (data.dataValues.idCurrentUser && data.dataValues.idFriend && data.dataValues.id_message) {
                            const user = await db.users.findOne({
                                where: { id: data.dataValues.idCurrentUser },
                                attributes: ['avatar', 'fullName', 'nickName', 'gender'],
                                raw: true,
                            });
                            const mes = await db.messages.create(
                                {
                                    id_message: data.dataValues.id_message,
                                    status: 1,
                                    title: title,
                                    createdAt: date,
                                },
                                { raw: true },
                            );
                            resolve({ id_friend: data.dataValues.idFriend, mes, user });
                        }
                    }
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    setRequest(id: string, id_friend: string) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('data here');
                // const dataFs = await db.friends.findOne({ where: { idFriend: id_friend }, raw: true });
                // if (!dataFs) {
                const data = await db.friends.create({ idCurrentUser: id, idFriend: id_friend }, { raw: true });
                if (data.dataValues.idFriend) {
                    resolve(data.dataValues.idFriend);
                    // }
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}
export default new PeopleService();
