import { RoomChats } from '../../models/mongodb/chats';
import DateTime from '../../DateTimeCurrent/DateTimeCurrent';
const Sequelize = require('sequelize');
const { ObjectId } = require('mongodb');
const Op = Sequelize.Op;
const URL = 'mongodb+srv://Spaceship:hung0507200301645615023@cluster0.chumwfw.mongodb.net/spaceship';

const db = require('../../models');

class SendChatService {
    send(id: string, id_others: string, value: string, files: any) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(files);
                const ids_file: any = files.map((f: any) => f.metadata.id_file.toString());
                console.log(ids_file, 'id');
                const imagesOrVideos: { v: any; icon: string }[] = [];
                const res = await RoomChats.findOne({ id_us: { $all: [id, id_others] } });
                console.log(res, 'RoomChats.findOne');

                if (!res) {
                    const friend = await db.friends.findOne({
                        where: {
                            [Op.or]: [
                                { idCurrentUser: id, idFriend: id_others, level: 2 },
                                { idCurrentUser: id_others, idFriend: id, level: 2 },
                            ],
                        },
                    });
                    if (ids_file) {
                        for (let id of ids_file) {
                            console.log(id);
                            imagesOrVideos.push({ v: id, icon: '' });
                        }
                    }
                    const room = await RoomChats.create({
                        id_us: [id, id_others],
                        status: friend ? 'isFriend' : 'isNotFriend',
                        background: '',
                        room: [
                            {
                                _id: id,
                                text: {
                                    t: value,
                                },
                                imageOrVideos: imagesOrVideos,
                            },
                        ],
                    });
                    if (room) {
                        const addRoom_you = await db.roomChats.create(
                            {
                                id_user: id,
                                id_room: room._id.toString(),
                                createdAt: DateTime(),
                            },
                            { raw: true },
                        );
                        const addRoom_others = await db.roomChats.create(
                            {
                                id_user: id_others,
                                id_room: room._id.toString(),
                                createdAt: DateTime(),
                            },
                            { raw: true },
                        );
                        console.log(addRoom_you, 'addRoom', addRoom_others);
                    }
                    console.log(res, 'send chat', DateTime(), room);
                    resolve(room);
                } else {
                    if (ids_file) {
                        for (let id of ids_file) {
                            console.log(id);
                            imagesOrVideos.push({ v: id, icon: '' });
                        }
                    }
                    console.log(value, 'value', id, id_others);
                    const arr: any = {
                        text: {
                            t: value,
                            icon: '',
                        },
                        _id: id,
                        seenBy: [],
                        imageOrVideos: imagesOrVideos,
                    };
                    const roomUpdate = await RoomChats.findOne({ id_us: { $all: [id, id_others] } }).exec(function (
                        err,
                        book,
                    ) {
                        if (err) console.log(err);
                        book?.room.push(arr);
                        book?.save();
                    });
                    console.log(roomUpdate, 'roomUpdate');
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    getRoom(id: string, limit: number, offset: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const res_id = await db.roomChats
                    .findAll({
                        where: { id_user: id },
                        limit: limit,
                        offset: offset,
                        order: [['createdAt', 'DESC']],
                        raw: true,
                    })
                    .then((rs: any) => rs.map((r: { id_room: any }) => r.id_room));

                const newId = res_id.map((id: any) => ObjectId(id));
                console.log(res_id, 'res_id', newId);
                const roomChat = await RoomChats.aggregate([
                    { $match: { _id: { $in: newId } } }, // Lọc theo điều kiện tương ứng với _id của document
                    { $unwind: '$room' }, // Tách mỗi phần tử trong mảng room thành một document riêng
                    { $sort: { 'room.createdAt': -1 } }, // Sắp xếp theo trường createdAt trong mỗi phần tử room
                    {
                        $group: {
                            _id: '$_id',
                            createdAt: { $first: '$createdAt' },
                            id_us: { $first: '$id_us' },
                            user: { $first: '$user' },
                            room: { $first: '$room' },
                        },
                    }, // Gom các document thành một mảng room
                    { $sort: { createdAt: -1 } },
                ]);
                console.log(roomChat, 'roomChat');

                const id_user: any = [];
                async function fetch(id_u: string) {
                    return await db.users.findOne({
                        where: { id: id_u },
                        attributes: ['id', 'avatar', 'fullName', 'gender'],
                        raw: true,
                    });
                }
                const newData = await new Promise<any>(async (resolve1, reject) => {
                    try {
                        const newD = await new Promise<any>((resolve2, reject) => {
                            try {
                                roomChat.map(async (rs, index) => {
                                    const dd: any = await new Promise((resolve3, reject) => {
                                        try {
                                            const sd = rs.id_us.map(async (id_u: any) => {
                                                if (id_u !== id) {
                                                    const df = await fetch(id_u);
                                                    roomChat[index].user.push(df);
                                                    resolve3(roomChat);
                                                }
                                            });
                                        } catch (error) {
                                            reject(error);
                                        }
                                    });
                                    const chat = await fetch(rs.room._id);
                                    dd[index].room.user = chat;
                                    if (index + 1 === roomChat.length) resolve2(dd);
                                });
                            } catch (error) {
                                reject(error);
                            }
                        });
                        console.log(newD, 'newD');

                        resolve1(newD);
                    } catch (error) {
                        reject(error);
                    }
                });
                console.log(newData);

                resolve(newData);
            } catch (error) {
                reject(error);
            }
        });
    }
    getChat(id_room: string, id: string, id_other: string, limit: number, offset: number) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(id_room, id, id_other, limit, offset);

                const roomChat = await RoomChats.aggregate([
                    { $match: { _id: ObjectId(id_room) } }, // Match the document with the specified roomId
                    { $unwind: '$room' }, // Unwind the room array
                    { $sort: { 'room.createdAt': 1 } }, // Sort by createdAt field in descending order
                    { $skip: offset }, // Skip the specified number of documents
                    { $limit: limit }, // Limit the number of documents to retrieve
                    {
                        $group: {
                            _id: '$_id',
                            id_us: { $first: '$id_us' },
                            bakcground: { $first: '$bakcground' },
                            status: { $first: '$status' },
                            room: { $push: '$room' },
                            createdAt: { $first: '$createdAt' },
                        },
                    }, // Group the documents and reconstruct the room array
                ]);
                console.log(roomChat[0], 'roomChat');

                resolve(roomChat);
            } catch (error) {
                reject(error);
            }
        });
    }
}
export default new SendChatService();
