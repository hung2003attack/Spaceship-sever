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
                // const friends_id_first = await db.friends
                //     .findAll({
                //         where: {
                //             [Op.or]: [
                //                 { idCurrentUser: id, level: 1 },
                //                 { idFriend: id, level: 1 },
                //             ],
                //         },
                //         attributes: ['idFriend', 'idCurrentUser'],
                //         raw: true,
                //     })
                //     .then((fr: { idFriend: string; idCurrentUser: string }[]) =>
                //         fr.map((f) => (f.idFriend !== id ? f.idFriend : f.idCurrentUser !== id ? f.idCurrentUser : '')),
                //     );
                const friends_id = await db.friends
                    .findAll({
                        where: {
                            [Op.or]: [
                                { idCurrentUser: id, level: 2 },
                                { idFriend: id, level: 2 },
                            ],
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
                            [Op.or]: [
                                { id_user: id, really: 1 },
                                { id_relative: id, really: 1 },
                            ],
                        },
                        attributes: ['id_user', 'id_relative', 'createdAt'],
                        raw: true,
                    })
                    .then((rel: { id_user: string; id_relative: string }[]) =>
                        rel.map((r) => (r.id_user !== id ? r.id_user : r.id_relative !== id ? r.id_relative : '')),
                    );
                const attributes = ['id', 'avatar', 'fullName', 'nickName', 'gender', 'birthday'];

                const data_f_Users = await db.users.findAll({
                    where: { id: { [Op.in]: friends_id } },
                    attributes: attributes,
                    include: [
                        {
                            model: db.friends,
                            where: {
                                [Op.or]: [{ idCurrentUser: id }, { idFriend: id }],
                            },
                            as: 'id_f_user',
                            attributes: ['idCurrentUser', 'idFriend', 'level', 'createdAt'],
                            required: true,
                        },
                        {
                            model: db.relatives,
                            where: {
                                [Op.or]: [
                                    { id_user: id, really: 0 },
                                    { id_relative: id, really: 0 },
                                ],
                            },
                            as: 'id_r_user',
                            attributes: ['id_user', 'id_relative', 'title', 'really', 'createdAt'],
                            required: false,
                        },
                        {
                            model: db.relatives,
                            where: {
                                [Op.or]: [
                                    { id_user: id, really: 0 },
                                    { id_relative: id, really: 0 },
                                ],
                            },
                            as: 'id_relative',
                            attributes: ['id_user', 'id_relative', 'title', 'really', 'createdAt'],
                            required: false,
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
                        {
                            model: db.relatives,
                            where: {
                                [Op.or]: [
                                    { id_user: id, really: 0 },
                                    { id_relative: id, really: 0 },
                                ],
                            },
                            as: 'id_r_user',
                            attributes: ['id_user', 'id_relative', 'title', 'really', 'createdAt'],
                            required: false,
                        },
                        {
                            model: db.relatives,
                            where: {
                                [Op.or]: [
                                    { id_user: id, really: 0 },
                                    { id_relative: id, really: 0 },
                                ],
                            },
                            as: 'id_relative',
                            attributes: ['id_user', 'id_relative', 'title', 'really', 'createdAt'],
                            required: false,
                        },
                    ],
                    raw: true,
                    nest: true,
                });

                const d_relatives_first = await db.users.findAll({
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
                const d_relatives_second = await db.users.findAll({
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

                const all_id = friends_id.concat(relatives_id);
                const data_relatives = d_relatives_first.concat(d_relatives_second);
                const dataAllFriends = data_f_Users.concat(dataFriends);

                all_id.push(id);
                const dataStrangers = await db.users.findAll({
                    where: { id: { [Op.notIn]: all_id } },
                    order: db.sequelize.random(),
                    limit: 20,
                    include: [
                        {
                            model: db.friends,
                            where: {
                                [Op.or]: [
                                    { idCurrentUser: id, level: 1 },
                                    { idFriend: id, level: 1 },
                                ],
                            },
                            as: 'id_friend',
                            attributes: ['idCurrentUser', 'idFriend', 'level', 'createdAt'],
                            raw: true,
                            required: false,
                        },
                        {
                            model: db.friends,
                            where: {
                                [Op.or]: [
                                    { idCurrentUser: id, level: 1 },
                                    { idFriend: id, level: 1 },
                                ],
                            },
                            as: 'id_f_user',
                            attributes: ['idCurrentUser', 'idFriend', 'level', 'createdAt'],
                            required: false,
                        },
                        {
                            model: db.relatives,
                            where: {
                                [Op.or]: [
                                    { id_user: id, really: 0 },
                                    { id_relative: id, really: 0 },
                                ],
                            },
                            as: 'id_r_user',
                            attributes: ['id_user', 'id_relative', 'title', 'really', 'createdAt'],
                            required: false,
                        },
                        {
                            model: db.relatives,
                            where: {
                                [Op.or]: [
                                    { id_user: id, really: 0 },
                                    { id_relative: id, really: 0 },
                                ],
                            },
                            as: 'id_relative',
                            attributes: ['id_user', 'id_relative', 'title', 'really', 'createdAt'],
                            required: false,
                        },
                    ],
                    attributes: attributes,
                    raw: true,
                    nest: true,
                });

                resolve({ strangers: dataStrangers, friends: dataAllFriends, family: data_relatives });
            } catch (error) {
                reject(error);
            }
        });
    }
    setFriend(id: string, id_friend: string) {
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
                            createdAt: date,
                        },
                    });
                    const id_user = data[0].dataValues.idCurrentUser;
                    const id_fr = data[0].dataValues.idFriend;

                    console.log(data, id_user, id_fr);
                    if (data[0]._options.isNewRecord && id_user && id_fr) {
                        const fl = await db.follows.findOrCreate({
                            where: {
                                [Op.or]: [
                                    { id_following: id_user, id_followed: id_fr },
                                    { id_following: id_fr, id_followed: id_user },
                                ],
                            },
                            defaults: {
                                id_following: id_user,
                                id_followed: id_fr,
                                flwing: 2,
                                flwed: 1,
                                createdAt: date,
                                updatedAt: date,
                            },
                        });
                        console.log('follow', fl);

                        const user = await db.users.findOne({
                            where: { id: id_user },
                            attributes: ['id', 'avatar', 'fullName', 'nickName', 'gender'],
                            raw: true,
                        });
                        user.status = 1;
                        user.id_f_user;
                        user.id_f_user = { createdAt: data[0].dataValues.createdAt };
                        resolve({
                            id_friend: id_fr,
                            user,
                            data: data[0],
                            quantity: 1,
                        });
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
    getFriends(id: string, offset: number, limit: number, type: string) {
        return new Promise(async (resolve, reject) => {
            try {
                if (type === 'yousent') {
                    const you_id = await db.friends
                        .findAll({
                            where: {
                                idCurrentUser: id,
                                level: 1,
                            },
                            attributes: ['idFriend', 'idCurrentUser'],
                            raw: true,
                        })
                        .then((fr: { idFriend: string; idCurrentUser: string }[]) =>
                            fr.map((f) =>
                                f.idFriend !== id ? f.idFriend : f.idCurrentUser !== id ? f.idCurrentUser : '',
                            ),
                        );
                    const dataYousent = await db.users.findAll({
                        where: { id: { [Op.in]: you_id } },
                        offset: offset,
                        limit: limit,
                        attributes: ['id', 'avatar', 'fullName', 'nickName', 'gender', 'birthday'],
                        raw: true,
                    });
                    resolve(dataYousent);
                } else if (type === 'others') {
                    const ohters_id = await db.friends
                        .findAll({
                            where: {
                                idFriend: id,
                                level: 1,
                            },
                            attributes: ['idFriend', 'idCurrentUser'],
                            raw: true,
                        })
                        .then((fr: { idFriend: string; idCurrentUser: string }[]) =>
                            fr.map((f) =>
                                f.idFriend !== id ? f.idFriend : f.idCurrentUser !== id ? f.idCurrentUser : '',
                            ),
                        );
                    const dataOthers = await db.users.findAll({
                        where: { id: { [Op.in]: ohters_id } },
                        offset: offset,
                        limit: limit,
                        attributes: ['id', 'avatar', 'fullName', 'nickName', 'gender', 'birthday'],
                        raw: true,
                    });
                    resolve(dataOthers);
                } else {
                    const friends_id = await db.friends
                        .findAll({
                            where: {
                                [Op.or]: [
                                    { idCurrentUser: id, level: 2 },
                                    { idFriend: id, level: 2 },
                                ],
                            },
                            attributes: ['idFriend', 'idCurrentUser'],
                            raw: true,
                        })
                        .then((fr: { idFriend: string; idCurrentUser: string }[]) =>
                            fr.map((f) =>
                                f.idFriend !== id ? f.idFriend : f.idCurrentUser !== id ? f.idCurrentUser : '',
                            ),
                        );

                    const dataFriends = await db.users.findAll({
                        where: { id: { [Op.in]: friends_id } },
                        offset: offset,
                        limit: limit,
                        attributes: ['id', 'avatar', 'fullName', 'nickName', 'gender', 'birthday'],
                        raw: true,
                    });

                    resolve(dataFriends);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    // {idCurrentUser: id_user, idFriend: id_req},{idCurrentUser: id_req,idFriend: id_user}
    delete(id_user: string, id_req: string, kindOf?: string) {
        return new Promise(async (resolve, reject) => {
            try {
                if (kindOf) {
                    if (kindOf === 'friends') {
                        const data = await db.friends.findOne({
                            where: {
                                [Op.or]: [
                                    { idCurrentUser: id_user, idFriend: id_req },
                                    { idCurrentUser: id_req, idFriend: id_user },
                                ],
                            },
                        });
                        if (data) {
                            await data.destroy();
                            resolve(data);
                        }
                        resolve(false);
                    } else {
                        console.log('relative', kindOf);
                    }
                } else {
                    console.log('all');
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    setConfirm(id: string, id_fr: string, kindOf: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const date = moment().format('YYYY-MM-DD HH:mm:ss');
                if (kindOf) {
                    if (kindOf === 'friends') {
                        const res = await db.friends.update(
                            {
                                level: 2,
                            },
                            { where: { idCurrentUser: id_fr, idFriend: id, level: 1 }, raw: true },
                        );
                        const fl = await db.follows.findOrCreate({
                            where: {
                                [Op.or]: [
                                    { id_following: id_fr, id_followed: id },
                                    { id_following: id, id_followed: id_fr },
                                ],
                            },
                            defaults: {
                                id_following: id,
                                id_followed: id_fr,
                                flwing: 2,
                                flwed: 1,
                                createdAt: date,
                                updatedAt: date,
                            },
                        });
                        if (!fl[0]._options.isNewRecord) {
                            const flU = await db.follows.update(
                                { flwed: 2, updatedAt: date },
                                {
                                    where: { id_following: id_fr, id_followed: id },
                                },
                            );
                            console.log(fl, 'confirm and follow', flU);
                        }

                        resolve({ ok: res[0], id_fr: id_fr, id: id });
                    }
                } else {
                    console.log('relatives');
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    getStrangers(id: string, offset: number, limit: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const friends_id = await db.friends
                    .findAll({
                        where: {
                            [Op.or]: [
                                { idCurrentUser: id, level: 2 },
                                { idFriend: id, level: 2 },
                            ],
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
                            [Op.or]: [
                                { id_user: id, really: 1 },
                                { id_relative: id, really: 1 },
                            ],
                        },
                        attributes: ['id_user', 'id_relative', 'createdAt'],
                        raw: true,
                    })
                    .then((rel: { id_user: string; id_relative: string }[]) =>
                        rel.map((r) => (r.id_user !== id ? r.id_user : r.id_relative !== id ? r.id_relative : '')),
                    );
                const attributes = ['id', 'avatar', 'fullName', 'nickName', 'gender', 'birthday'];

                const all_id = friends_id.concat(relatives_id);
                all_id.push(id);
                const dataStrangers = await db.users.findAll({
                    where: { id: { [Op.notIn]: all_id } },
                    order: db.sequelize.random(),
                    offset: offset,
                    limit: limit,
                    include: [
                        {
                            model: db.friends,
                            where: {
                                [Op.or]: [
                                    { idCurrentUser: id, level: 1 },
                                    { idFriend: id, level: 1 },
                                ],
                            },
                            as: 'id_friend',
                            attributes: ['idCurrentUser', 'idFriend', 'level', 'createdAt'],
                            raw: true,
                            required: false,
                        },
                        {
                            model: db.friends,
                            where: {
                                [Op.or]: [
                                    { idCurrentUser: id, level: 1 },
                                    { idFriend: id, level: 1 },
                                ],
                            },
                            as: 'id_f_user',
                            attributes: ['idCurrentUser', 'idFriend', 'level', 'createdAt'],
                            required: false,
                        },
                        {
                            model: db.relatives,
                            where: {
                                [Op.or]: [
                                    { id_user: id, really: 0 },
                                    { id_relative: id, really: 0 },
                                ],
                            },
                            as: 'id_r_user',
                            attributes: ['id_user', 'id_relative', 'title', 'really', 'createdAt'],
                            required: false,
                        },
                        {
                            model: db.relatives,
                            where: {
                                [Op.or]: [
                                    { id_user: id, really: 0 },
                                    { id_relative: id, really: 0 },
                                ],
                            },
                            as: 'id_relative',
                            attributes: ['id_user', 'id_relative', 'title', 'really', 'createdAt'],
                            required: false,
                        },
                    ],
                    attributes: attributes,
                    raw: true,
                    nest: true,
                });
                resolve(dataStrangers);
            } catch (error) {
                reject(error);
            }
        });
    }
}
export default new PeopleService();
