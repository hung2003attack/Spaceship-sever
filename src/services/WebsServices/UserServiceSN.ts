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
    more?: PropsParamsMores;
}
interface PropsParamsMores {
    position?: string;
    star?: string;
    love?: string;
    visit?: string;
    follow?: string;
    following?: string;
}
class UserService {
    getById(id: string, id_req: string, params: PropsParams, mores: PropsParamsMores, first?: string) {
        return new Promise(
            async (resolve: (arg0: { status: number; data?: any }) => void, reject: (arg0: unknown) => void) => {
                try {
                    console.log(mores, Object.keys(mores));
                    const paramsUser = Object.keys(params);
                    const paramsMore = Object.keys(mores);
                    const attrF = ['idCurrentUser', 'idFriend', 'level', 'createdAt'];
                    const attrFl = ['id_following', 'id_followed', 'flwing', 'flwed', 'createdAt', 'updatedAt'];
                    if (first) {
                        const data = await db.users.findOne({
                            where: { id: id_req },
                            attributes: paramsUser,
                            raw: true,
                        });
                        if (data) resolve({ status: 1, data: data });
                    } else {
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
                                {
                                    model: db.loves,
                                    where: {
                                        id_loved: id,
                                    },
                                    as: 'id_loved_user',
                                    attributes: ['id_loved'],
                                    required: false,
                                },
                            ],
                            nest: true,
                            raw: true,
                        });
                        const count_flwi = await db.follows.count({
                            where: {
                                [Op.or]: [
                                    { id_following: id_req, flwing: 2 },
                                    { id_followed: id_req, flwed: 2 },
                                ],
                            },
                        });

                        const count_flwe = await db.follows.count({
                            where: {
                                [Op.or]: [
                                    { id_following: id_req, flwed: 2 },
                                    { id_followed: id_req, flwing: 2 },
                                ],
                            },
                        });
                        const count_friends = await db.friends.count({
                            where: {
                                [Op.or]: [
                                    { idCurrentUser: id_req, level: 2 },
                                    { idFriend: id_req, level: 2 },
                                ],
                            },
                        });
                        const count_loves = await db.loves.count({ where: { id_user: id_req } });
                        console.log('loves', count_loves);
                        data.id_m_user.love = count_loves;
                        data.id_m_user.friends = count_friends;
                        data.id_m_user.following = count_flwi;
                        data.id_m_user.follow = count_flwe;
                        if (data) resolve({ status: 1, data: data });
                    }

                    resolve({ status: 0 });
                } catch (error) {
                    reject(error);
                }
            },
        );
    }
    getMore(id: string, offset: number, limit: number) {
        return new Promise(async (resolve: any, reject: (arg0: unknown) => void) => {
            try {
                console.log(offset, limit);

                const id_flwi = await db.follows
                    .findAll({
                        where: {
                            [Op.or]: [
                                { id_following: id, flwing: 2 },
                                { id_followed: id, flwed: 2 },
                            ],
                        },
                        offset: offset,
                        limit: limit,
                        attributes: ['id_followed', 'id_following'],
                        raw: true,
                    })
                    .then((resl: { id_following: string; id_followed: string }[]) => {
                        return resl.map((fl) => {
                            if (fl.id_followed !== id) {
                                return fl.id_followed;
                            } else {
                                return fl.id_following;
                            }
                        });
                    });
                const id_flwe = await db.follows
                    .findAll({
                        where: {
                            [Op.or]: [
                                { id_following: id, flwed: 2 },
                                { id_followed: id, flwing: 2 },
                            ],
                        },
                        offset: offset,
                        limit: limit,
                        attributes: ['id_following', 'id_followed'],
                        raw: true,
                    })
                    .then((resl: { id_following: string; id_followed: string }[]) => {
                        return resl.map((fl) => {
                            if (fl.id_followed !== id) {
                                return fl.id_followed;
                            } else {
                                return fl.id_following;
                            }
                        });
                    });
                console.log('i don t know');

                const flwing_data = await db.users.findAll({
                    where: { id: { [Op.in]: id_flwi } },
                    attributes: ['id', 'avatar', 'fullName', 'gender'],
                    raw: true,
                });
                const flwed_data = await db.users.findAll({
                    where: { id: { [Op.in]: id_flwe } },
                    attributes: ['id', 'avatar', 'fullName', 'gender'],
                    raw: true,
                });
                resolve({ following: flwing_data, followed: flwed_data });
            } catch (error) {
                reject(error);
            }
        });
    }
    getByName(id: string, name: string, params: PropsParams) {
        return new Promise(
            async (resolve: (arg0: { status: number; data?: any }) => void, reject: (arg0: unknown) => void) => {
                try {
                    const data = await db.users.findAll({
                        where: {
                            id: { [Op.notIn]: [id] },
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
    changesOne(id: string, id_req: string, value: string, params: PropsParams) {
        return new Promise(async (resolve: (arg0: number) => void, reject: (arg0: unknown) => void) => {
            try {
                const at: any = params.avatar;
                const att: any = params.background;
                const name = params.fullName;
                const nickName = params.nickName;
                const more = params.more;
                const date = moment().format('YYYY-MM-DD HH:mm:ss');

                if (more) {
                    const love = more.love;
                    if (love === 'love') {
                        const resLoves = await db.loves.findOrCreate({
                            where: {
                                [Op.and]: [{ id_user: id }, { id_loved: id_req }],
                            },
                            defaults: {
                                id_user: id,
                                id_loved: id_req,
                                createdAt: date,
                            },
                        });
                    } else if (love === 'unlove') {
                        const resLoves = await db.loves.destroy({
                            where: {
                                [Op.and]: [{ id_user: id }, { id_loved: id_req }],
                            },
                        });
                    }
                    const count_loves = await db.loves.count({ where: { id_user: id } });
                    console.log(count_loves, 'count_loves ');
                    resolve(count_loves);
                } else {
                    if (name || nickName) if (value.length > 30) resolve(0);
                    const data = await db.users.update(
                        { [`${at || att || name || nickName}`]: value },
                        {
                            where: { id: id },
                        },
                    );
                    console.log('value', value, data);
                    resolve(data[0]);
                }
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
                const count_flwe = await db.follows.count({
                    where: {
                        [Op.or]: [
                            { id_following: id, flwed: 2 },
                            { id_followed: id, flwing: 2 },
                        ],
                    },
                });
                resolve({ ok, id, id_fl, count_flwe, follow: !follow ? 0 : follow });
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
                const count_flwe = await db.follows.count({
                    where: {
                        [Op.or]: [
                            { id_following: id, flwed: 2 },
                            { id_followed: id, flwing: 2 },
                        ],
                    },
                });
                resolve({ ok, id, id_fl, count_flwe, unfollow });
            } catch (error) {
                reject(error);
            }
        });
    }
}
export default new UserService();
