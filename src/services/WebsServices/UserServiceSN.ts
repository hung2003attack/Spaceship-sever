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
                                    [Op.or]: [{ idCurrentUser: id }, { idFriend: id }],
                                },
                                as: 'id_friend',
                                attributes: ['idCurrentUser', 'idFriend', 'level', 'createdAt'],
                                raw: true,
                                required: false,
                            },
                            {
                                model: db.friends,
                                where: {
                                    [Op.or]: [{ idCurrentUser: id }, { idFriend: id }],
                                },
                                as: 'id_f_user',
                                attributes: ['idCurrentUser', 'idFriend', 'level', 'createdAt'],
                                required: false,
                            },
                        ],
                        nest: true,
                        raw: true,
                    });
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
        return new Promise(
            async (resolve: (arg0: { status: number; data?: any }) => void, reject: (arg0: unknown) => void) => {
                try {
                    const at: any = params.avatar;
                    const att: any = params.background;
                    const name = params.fullName;
                    const data = await db.users.update(
                        { [`${at || att || name}`]: value },
                        {
                            where: { id: id },
                        },
                    );
                    console.log('value', value, data);

                    resolve(data[0]);
                } catch (error) {
                    reject(error);
                }
            },
        );
    }
}
export default new UserService();
