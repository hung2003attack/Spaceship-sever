import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const chats = new Schema(
    {
        status: { type: String, maxLength: 10 },
        background: { type: String, maxLength: 50 },
        room: [
            {
                id_user: { type: String, require: true, maxLength: 50 },
                chat: [
                    {
                        text: {
                            t: { type: String, text: true },
                            icon: { type: String },
                        },
                        imageOrVideos: [{ v: { type: String, maxLength: 50 }, icon: { type: String, maxLength: 1 } }],
                    },
                ],
                createdAt: { type: Date, default: Date.now },
            },
        ],
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    },
);
export const RoomChats = mongoose.model('chats', chats);
