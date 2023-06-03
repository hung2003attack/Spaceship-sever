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
class UserService {
    getById(id: string, params: PropsParams) {
        return new Promise(
            async (resolve: (arg0: { status: number; data?: any }) => void, reject: (arg0: unknown) => void) => {
                try {
                    const data = await db.users.findOne({
                        where: { id: id },
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
}
export default new UserService();
