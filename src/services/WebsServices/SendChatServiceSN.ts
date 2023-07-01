import { RoomChats } from '../../models/mongodb/chats';
import DateTime from '../../DateTimeCurrent/DateTimeCurrent';
const Sequelize = require('sequelize');
const { ObjectId } = require('mongodb');
const Op = Sequelize.Op;
const URL = 'mongodb+srv://Spaceship:hung0507200301645615023@cluster0.chumwfw.mongodb.net/spaceship';

const db = require('../../models');

class SendChatService {
    send(id_room: string, id: string, id_others: string, value: string, files: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const ids_file: any = files.map((f: any) => f.metadata.id_file.toString());
                const AllOfFile: string[] = [];
                const imagesOrVideos: { v: any; icon: string }[] = [];
                const res = await RoomChats.findOne({ _id: ObjectId(id_room), id_us: { $all: [id, id_others] } });
                console.log(res, 'RoomChats.findOne');
                if (ids_file) {
                    for (let id of ids_file) {
                        AllOfFile.push(id);
                        console.log(id);
                        imagesOrVideos.push({ v: id, icon: '' });
                    }
                }
                if (!res) {
                    const friend = await db.friends.findOne({
                        where: {
                            [Op.or]: [
                                { idCurrentUser: id, idFriend: id_others, level: 2 },
                                { idCurrentUser: id_others, idFriend: id, level: 2 },
                            ],
                        },
                    });

                    const room = await RoomChats.create({
                        id_us: [id, id_others],
                        status: friend ? 'isFriend' : 'isNotFriend',
                        imageOrVideos: AllOfFile,
                        background: '',
                        room: [
                            {
                                _id: id,
                                text: {
                                    t: value,
                                },
                                imageOrVideos: imagesOrVideos,
                                createdAt: DateTime(),
                            },
                        ],
                        createdAt: DateTime(),
                    });
                    if (room) {
                        await db.roomChats.create(
                            {
                                id_user: id,
                                id_room: room._id.toString(),
                                createdAt: DateTime(),
                            },
                            { raw: true },
                        );
                        await db.roomChats.create(
                            {
                                id_user: id_others,
                                id_room: room._id.toString(),
                                createdAt: DateTime(),
                            },
                            { raw: true },
                        );
                    }
                    console.log(res, 'send chat', DateTime(), room);
                    resolve(room);
                } else {
                    console.log(ids_file, 'ids_file');
                    console.log(id_room, value, 'value', id, id_others);
                    const arr: any = {
                        text: {
                            t: value,
                            icon: '',
                        },
                        _id: id,
                        seenBy: [],
                        imageOrVideos: imagesOrVideos,
                        createdAt: DateTime(),
                    };

                    const roomUpdate = await RoomChats.updateOne(
                        {
                            _id: ObjectId(id_room),
                            id_us: { $all: [id, id_others] },
                        },
                        { $push: { room: arr, imageOrVideos: { $each: AllOfFile } } },
                    );

                    resolve(roomUpdate.acknowledged);
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
                    { $sort: { 'room.createdAt': -1 } },
                ]);
                console.log(roomChat, 'roomChat');
                const newData = await new Promise<any>(async (resolve2, reject) => {
                    try {
                        await Promise.all(
                            roomChat.map(async (rs, index) => {
                                const dd: any = await new Promise(async (resolve3, reject) => {
                                    try {
                                        const sd = await Promise.all(
                                            rs.id_us.map(async (id_u: any) => {
                                                if (id_u !== id) {
                                                    const df = await db.users.findOne({
                                                        where: { id: id_u },
                                                        attributes: ['id', 'avatar', 'fullName', 'gender'],
                                                        raw: true,
                                                    });
                                                    console.log(df, 'dfff');

                                                    roomChat[index].user.push(df);
                                                }
                                            }),
                                        );
                                        resolve3(roomChat);
                                    } catch (error) {
                                        reject(error);
                                    }
                                });
                            }),
                        );
                        resolve2(roomChat);
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
    getChat(id_room: string, id: string, id_other: string, limit: number, offset: number, of: boolean) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(id_room, id, id_other, limit, offset);
                const Group = of
                    ? {
                          _id: '$_id',
                          room: { $push: '$room' },
                      }
                    : {
                          _id: '$_id',
                          id_us: { $first: '$id_us' },
                          bakcground: { $first: '$bakcground' },
                          status: { $first: '$status' },
                          room: { $push: '$room' },
                          createdAt: { $first: '$createdAt' },
                      };
                const roomChat = await RoomChats.aggregate([
                    { $match: { _id: ObjectId(id_room) } }, // Match the document with the specified roomId
                    { $unwind: '$room' }, // Unwind the room array
                    { $sort: { 'room.createdAt': -1 } }, // Sort by createdAt field in descending order
                    { $skip: offset }, // Skip the specified number of documents
                    { $limit: limit }, // Limit the number of documents to retrieve
                    {
                        $group: Group,
                    }, // Group the documents and reconstruct the room array
                ]);
                console.log(roomChat[0], 'roomChat', of);
                resolve(roomChat[0]);
            } catch (error) {
                reject(error);
            }
        });
    }
}
export default new SendChatService();
