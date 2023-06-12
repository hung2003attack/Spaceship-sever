import moment from 'moment';
import { Promise } from 'mongoose';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const db = require('../../models');
interface PropsParams {
    fullName?: string;
    nickName?: string;
    status?: string;
    gender?: string;
    background?: string;
    avatar?: string;
    admin?: string;
    hobby?: string;
    strengths?: string;
    adress?: string;
    skill?: string;
    birthDate?: string;
    occupation?: string;
    experience?: string;
    createdAt?: string;
    sn?: string;
    l?: string;
    w?: string;
}
interface PropsParamsMores {
    position: string;
    star?: number;
    love?: number;
    visit?: number;
    follow?: number;
    following?: number;
}
class UserService {
    getById(id: string, id_req: string, params: PropsParams, mores: PropsParamsMores, personal?: string) {
        return new Promise(
            async (resolve: (arg0: { status: number; data?: any }) => void, reject: (arg0: unknown) => void) => {
                try {
                    console.log(mores, Object.keys(mores));
                    const paramsUser = Object.keys(params);
                    const paramsMore = Object.keys(mores);
                    const attrF = ['idCurrentUser', 'idFriend', 'level', 'createdAt'];
                    const attrFl = ['id_following', 'id_followed', 'flwing', 'flwed', 'createdAt', 'updatedAt'];
                    const data = await db.users.findOne({
                        where: { id: id_req },
                        attributes: paramsUser,
                        include: [
                            {
                                model: db.mores,
                                where: { id_user: id_req },
                                attributes: paramsMore,
                                as: 'id_m_user',
                                require: true,
                            },
                            {
                                model: db.friends,
                                where: {
                                    idCurrentUser: id,
                                },
                                as: 'id_friend',
                                attributes: attrF,
                                raw: true,
                                required: false,
                            },
                            {
                                model: db.friends,
                                where: {
                                    idFriend: id,
                                },
                                as: 'id_f_user',
                                attributes: attrF,
                                required: false,
                            },
                            {
                                model: db.follows,
                                where: {
                                    id_followed: id,
                                },
                                as: 'id_flwing',
                                attributes: attrFl,
                                required: false,
                            },
                            {
                                model: db.follows,
                                where: {
                                    id_following: id,
                                },
                                as: 'id_flwed',
                                attributes: attrFl,
                                required: false,
                            },
                        ],
                        nest: true,
                        raw: true,
                    });
                    const id_flwi = await db.follows
                        .findAndCountAll({
                            where: {
                                [Op.or]: [
                                    { id_following: id, flwing: 2 },
                                    { id_followed: id, flwed: 2 },
                                ],
                            },
                            attributes: ['id_followed', 'id_following'],
                            raw: true,
                        })
                        .then((resl: { count: number; rows: { id_following: string; id_followed: string }[] }) => {
                            return {
                                count: resl.count,
                                id_flwing: resl.rows.map((fl) => {
                                    if (fl.id_followed !== id) {
                                        return fl.id_followed;
                                    } else {
                                        return fl.id_following;
                                    }
                                }),
                            };
                        });
                    const id_flwe = await db.follows
                        .findAndCountAll({
                            where: {
                                [Op.or]: [
                                    { id_following: id, flwed: 2 },
                                    { id_followed: id, flwing: 2 },
                                ],
                            },
                            attributes: ['id_following', 'id_followed'],
                            raw: true,
                        })
                        .then((resl: { count: number; rows: { id_following: string; id_followed: string }[] }) => {
                            return {
                                count: resl.count,
                                id_flwed: resl.rows.map((fl) => {
                                    if (fl.id_followed !== id) {
                                        return fl.id_followed;
                                    } else {
                                        return fl.id_following;
                                    }
                                }),
                            };
                        });

                    const flwing_data = await db.users.findAll({
                        where: { id: { [Op.in]: id_flwi.id_flwing } },
                        attributes: ['id', 'avatar', 'fullName', 'gender'],
                        raw: true,
                    });
                    const flwed_data = await db.users.findAll({
                        where: { id: { [Op.in]: id_flwe.id_flwed } },
                        attributes: ['id', 'avatar', 'fullName', 'gender'],
                        raw: true,
                    });
                    data.id_m_user.following = id_flwi.count;
                    data.id_m_user.flwing_data = flwing_data;
                    data.id_m_user.follow = id_flwe.count;
                    data.id_m_user.flwed_data = flwed_data;
                    if (data) resolve({ status: 1, data: data });

                    resolve({ status: 0 });
                } catch (error) {
                    reject(error);
                }
            },
        );
    }
    getByName(name: string, params: PropsParams) {
        return new Promise(
            async (resolve: (arg0: { status: number; data?: any }) => void, reject: (arg0: unknown) => void) => {
                try {
                    const data = await db.users.findAll({
                        where: {
                            fullName: {
                                [Op.like]: `%${name}%`,
                            },
                        },
                        attributes: Object.keys(params),
                        raw: true,
                    });
                    if (data) resolve({ status: 1, data });
                    resolve({ status: 0 });
                } catch (error) {
                    reject(error);
                }
            },
        );
    }
    setLg(id: string, lg: string) {
        return new Promise(async (resolve: (arg0: any) => void, reject: (arg0: unknown) => void) => {
            try {
                const data = await db.users.update({ sn: lg }, { where: { id: id } });
                resolve(data[0]);
            } catch (error) {
                reject(error);
            }
        });
    }
    setAs(ass: number, id: string) {
        return new Promise(async (resolve: (arg0: any) => void, reject: (arg0: unknown) => void) => {
            try {
                const data = await db.users.update({ as: ass }, { where: { id: id }, raw: true });
                console.log('As ', data[0]);

                resolve(data[0]);
            } catch (error) {
                reject(error);
            }
        });
    }
    getNewMes(id: string) {
        return new Promise(async (resolve: (arg0: { user: any }) => void, reject: (arg0: unknown) => void) => {
            try {
                const id_f = await db.friends
                    .findAll({
                        limit: 5,
                        where: { idFriend: id, level: 1 },
                        order: [['createdAt', 'DESC']],
                        raw: true,
                    })
                    .then((x: { idCurrentUser: string }[]) => x.map((v) => v.idCurrentUser));
                const us = await db.users
                    .findAll({
                        where: { id: { [Op.in]: id_f } },
                        include: [
                            {
                                model: db.friends,
                                where: {
                                    idCurrentUser: { [Op.in]: id_f },
                                    idFriend: id,
                                    level: 1,
                                },
                                as: 'id_f_user',
                                attributes: ['createdAt'],
                            },
                        ],
                        nest: true,
                        attributes: ['id', 'avatar', 'fullName', 'nickName', 'gender'],
                        raw: true,
                    })
                    .then((u: any) =>
                        u.map((s: any) => {
                            s.status = 1;
                            return s;
                        }),
                    );
                console.log('heeee---------------', id_f, 'ussss', us);
                resolve({ user: us });
            } catch (error) {
                reject(error);
            }
        });
    }
    changesOne(id: string, value: string, params: PropsParams) {
        return new Promise(async (resolve: (arg0: number) => void, reject: (arg0: unknown) => void) => {
            try {
                const at: any = params.avatar;
                const att: any = params.background;
                const name = params.fullName;
                const nickName = params.nickName;
                if (name || nickName) if (value.length > 30) resolve(0);
                const data = await db.users.update(
                    { [`${at || att || name || nickName}`]: value },
                    {
                        where: { id: id },
                    },
                );
                console.log('value', value, data);

                resolve(data[0]);
            } catch (error) {
                reject(error);
            }
        });
    }
    follow(id: string, id_fl: string, follow?: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const date = moment().format('YYYY-MM-DD HH:mm:ss');
                console.log(date, 'date', follow);
                let ok = 0;
                const res = await db.follows.findOrCreate({
                    where: {
                        [Op.or]: [
                            { id_following: id_fl, id_followed: id },
                            { id_following: id, id_followed: id_fl },
                        ],
                    },
                    defaults: {
                        id_following: id_fl,
                        id_followed: id,
                        flwing: 2,
                        flwed: 1,
                        createdAt: date,
                        updatedAt: date,
                    },
                });
                if (!res[0]._options.isNewRecord) {
                    if (follow === 'following') {
                        const flU = await db.follows.update(
                            { flwing: 2, updatedAt: date },
                            {
                                where: { id_following: id_fl, id_followed: id },
                            },
                        );
                        if (flU[0] === 1) ok = 1;
                    } else if (follow === 'followed') {
                        if (!res[0]._options.isNewRecord) {
                            const flU = await db.follows.update(
                                { flwed: 2, updatedAt: date },
                                {
                                    where: { id_following: id, id_followed: id_fl },
                                },
                            );
                            if (flU[0] === 1) ok = 1;
                        }
                    }
                } else {
                    console.log('oks');
                    ok = 1;
                }
                resolve({ ok, id, id_fl, follow: !follow ? 0 : follow });
            } catch (error) {
                reject(error);
            }
        });
    }
    Unfollow(id: string, id_fl: string, unfollow: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const date = moment().format('YYYY-MM-DD HH:mm:ss');
                console.log(date, 'date', unfollow);
                let ok = 0;
                const fl = await db.follows.findOne({
                    where: {
                        [Op.or]: [
                            { id_following: id_fl, id_followed: id },
                            { id_following: id, id_followed: id_fl },
                        ],
                    },
                });
                console.log(fl, 'flll');

                if (unfollow === 'following') {
                    if (fl?.dataValues.flwed === 1) {
                        const dt = await fl.destroy();
                        if (dt) ok = 1;
                    } else {
                        const res = await db.follows.update(
                            { flwing: 1 },
                            {
                                where: {
                                    [Op.or]: [{ id_following: id_fl, id_followed: id }],
                                },
                            },
                        );
                        if (res[0] === 1) ok = 1;
                        console.log(res, unfollow);
                    }
                } else {
                    if (fl?.dataValues.flwing === 1) {
                        const dt = await fl.destroy();
                        if (dt) ok = 1;
                    } else {
                        const res = await db.follows.update(
                            { flwed: 1 },
                            {
                                where: {
                                    [Op.or]: [{ id_following: id, id_followed: id_fl }],
                                },
                            },
                        );
                        if (res[0] === 1) ok = 1;
                        console.log(res, unfollow);
                    }
                }
                resolve({ ok, id, id_fl, unfollow });
            } catch (error) {
                reject(error);
            }
        });
    }
}
export default new UserService();
