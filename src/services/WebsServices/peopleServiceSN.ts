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
                const friends_id = await db.friends
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
                const relatives_id = await db.relatives
                    .findAll({
                        where: {
                            [Op.or]: [{ id_user: id }, { id_relative: id }],
                        },
                        attributes: ['id_user', 'id_relative', 'createdAt'],
                        raw: true,
                    })
                    .then((rel: { id_user: string; id_relative: string }[]) =>
                        rel.map((r) => (r.id_user !== id ? r.id_user : r.id_relative !== id ? r.id_relative : '')),
                    );
                const attributes = ['id', 'fullName', 'nickName', 'gender', 'birthday'];

                const data_f_Users = await db.users.findAll({
                    where: { id: { [Op.in]: friends_id } },
                    attributes: attributes,
                    include: [
                        {
                            model: db.friends,
                            where: {
                                [Op.or]: [{ idCurrentUser: id }, { idFriend: id }],
                            },
                            as: 'id_user',
                            attributes: ['idCurrentUser', 'idFriend', 'level', 'createdAt'],
                            required: true,
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                const dataFriends = await db.users.findAll({
                    where: { id: { [Op.in]: friends_id } },
                    attributes: attributes,
                    include: [
                        {
                            model: db.friends,
                            where: {
                                [Op.or]: [{ idCurrentUser: id }, { idFriend: id }],
                            },
                            as: 'id_friend',
                            attributes: ['idCurrentUser', 'idFriend', 'level', 'createdAt'],
                            required: true,
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                const data_r_user = await db.users.findAll({
                    where: { id: { [Op.in]: relatives_id } },
                    attributes: attributes,
                    include: [
                        {
                            model: db.relatives,
                            where: {
                                [Op.or]: [{ id_user: id }, { id_relative: id }],
                            },
                            as: 'id_r_user',
                            attributes: ['id_user', 'id_relative', 'title', 'really', 'createdAt'],
                            required: true,
                        },
                    ],
                    raw: true,
                    nest: true,
                });

                const data_relatives = await db.users.findAll({
                    where: { id: { [Op.in]: relatives_id } },
                    attributes: attributes,
                    include: [
                        {
                            model: db.relatives,
                            where: {
                                [Op.or]: [{ id_user: id }, { id_relative: id }],
                            },
                            as: 'id_relative',
                            attributes: ['id_user', 'id_relative', 'title', 'really', 'createdAt'],
                            required: true,
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                const dataAllRelatives = data_r_user.concat(data_relatives);
                const all_id = friends_id.concat(relatives_id);
                const dataAllFriends = data_f_Users.concat(dataFriends);

                all_id.push(id);
                const dataStrangers = await db.users.findAll({
                    where: { id: { [Op.notIn]: all_id } },
                    order: db.sequelize.random(),
                    limit: 20,
                    attributes: attributes,
                    raw: true,
                });
                console.log(dataAllFriends);

                resolve({ trangers: dataStrangers, friends: dataAllFriends, family: dataAllRelatives });
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
                        where: {
                            [Op.or]: [
                                { idCurrentUser: id, idFriend: id_friend },
                                { idCurrentUser: id_friend, idFriend: id },
                            ],
                        },
                        defaults: {
                            idCurrentUser: id,
                            idFriend: id_friend,
                            id_message: id_mess,
                            createdAt: date,
                        },
                    });
                    const id_user = data[0].dataValues.idCurrentUser;
                    const id_fr = data[0].dataValues.idFriend;
                    const id_message = data[0].dataValues.id_message;

                    console.log(data, id_user, id_fr, id_message);
                    if (data[0]._options.isNewRecord && id_user && id_fr && id_message) {
                        const user = await db.users.findOne({
                            where: { id: id_user },
                            attributes: ['avatar', 'fullName', 'nickName', 'gender'],
                            raw: true,
                        });
                        const mes = await db.messages.create(
                            {
                                id_message: id_message,
                                status: 1,
                                title: title,
                                createdAt: date,
                            },
                            { raw: true },
                        );
                        resolve({ id_friend: id_fr, mes, user });
                    } else {
                        console.log('Was friend');
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
