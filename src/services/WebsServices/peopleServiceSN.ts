import moment from 'moment';
import { io } from '../..';
import { v4 as primaryKey } from 'uuid';
moment.locale('vi');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../../models');

class PeopleService {
    getPeopleAll(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const friends = await db.friends
                    .findAll({
                        where: {
                            [Op.or]: [{ idCurrentUser: id }, { idFriend: id }],
                        },
                        attributes: ['idFriend', 'idCurrentUser'],
                        raw: true,
                    })
                    .then((fr: { idFriend: string; idCurrentUser: string }[]) =>
                        fr.map((f) => (f.idFriend !== id ? f.idFriend : f.idCurrentUser !== id ? f.idCurrentUser : '')),
                    );
                console.log(friends, 'friends');

                const relatives = await db.relatives
                    .findAll({
                        where: {
                            [Op.or]: [{ id_user: id }, { id_relative: id }],
                        },
                        attributes: ['id_user', 'id_relative', 'title', 'really'],
                        raw: true,
                    })
                    .then((rel: { id_user: string; id_relative: string }[]) => {
                        return {
                            id: rel.map((r) =>
                                r.id_user !== id ? r.id_user : r.id_relative !== id ? r.id_relative : '',
                            ),
                            full: rel.map((r) => (r.id_user !== id ? r : r.id_relative !== id ? r : '')),
                        };
                    });
                console.log('relative', relatives);

                const all = friends.concat(relatives.id);
                const attributes = ['id', 'fullName', 'nickName', 'gender', 'birthday'];
                console.log(friends, '--', relatives.id, ' == ', all);

                const dataUsers = await db.users.findAll({
                    where: { id: { [Op.in]: friends } },
                    attributes: attributes,
                    include: [
                        {
                            model: db.friends,
                            where: {
                                [Op.or]: [{ idCurrentUser: id }, { idFriend: id }],
                            },
                            as: 'id_user',
                            attributes: ['idCurrentUser', 'idFriend', 'level'],
                            required: true,
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                const dataFriends = await db.users.findAll({
                    where: { id: { [Op.in]: friends } },
                    attributes: attributes,
                    include: [
                        {
                            model: db.friends,
                            where: {
                                [Op.or]: [{ idCurrentUser: id }, { idFriend: id }],
                            },
                            as: 'id_friend',
                            attributes: ['idCurrentUser', 'idFriend', 'level'],
                            required: true,
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                const dataAll = dataUsers.concat(dataFriends);
                console.log(dataAll, 'dataFriends ', friends);

                all.push(id);
                for (let i = 0; i < 2; i++) {}
                const dataStrangers = await db.users.findAll({
                    where: { id: { [Op.notIn]: all } },
                    attributes: attributes,

                    raw: true,
                });

                // console.log({ tranger: dataStrangers, friends: dataFriends });
                // resolve({ tranger: dataStrangers, friends: dataFriends });
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

                const id_mess = primaryKey();
                if (id_mess) {
                    const data = await db.friends.findOrCreate({
                        where: { idCurrentUser: id, idFriend: id_friend },
                        defaults: {
                            idCurrentUser: id,
                            idFriend: id_friend,
                            id_message: id_mess,
                            createdAt: date,
                        },
                    });
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
    getFriendAll(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await db.friends.findAll({
                    where: {
                        [Op.or]: [
                            { idCurrentUser: id, level: 2 },
                            { idFriend: id, level: 2 },
                        ],
                    },
                    attributes: ['idCurrentUser', 'idFriend'],
                    raw: true,
                });
                console.log('get All Friends');

                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
}
export default new PeopleService();
