import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const chats = new Schema(
    {
        id_us: [String(50)],
        user: [],
        status: { type: String, maxLength: 11 },
        first: { id: { type: String, maxLength: 50 } },
        background: { type: String, maxLength: 50 },
        room: [
            {
                _id: { type: String, required: true, maxLength: 50 },
                text: {
                    t: { type: String, text: String },
                    icon: { type: String, default: '' },
                },
                imageOrVideos: [
                    { v: { type: String, maxLength: 50 }, icon: { type: String, maxLength: 1, default: '' } },
                ],
                seenBy: [String(50)],
                createdAt: { type: Date, default: Date.now() },
            },
            { _id: false },
        ],
        createdAt: { type: Date, default: Date.now() },
    },
    {
        timestamps: true,
    },
);
export const RoomChats = mongoose.model('chats', chats);
