import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const feel = {
    like: { type: Number(11), default: 0 },
    love: { type: Number(11), default: 0 },
    smile: { type: Number(11), default: 0 },
    sad: { type: Number(11), default: 0 },
};
const comments = [
    {
        id_user: { type: String(50), required: true },
        content: {
            text: { type: String, text: String },
            imageOrVideos: [{ file: { type: String(50) }, title: { type: String(30) }, feel }],
        },
        feel,
        reply: [
            {
                id_user: { type: String(50), required: true },
                content: { text: { type: String, text: String }, imageOrVideos: [String(50)] },
                feel,
            },
        ],
    },
];
const Posts = new Schema({
    id_user: { type: String(50), required: true },
    content: { text: { type: String, text: String }, imageOrVideos: [String(50)] },
    feel,
    amountComments: { type: Number(11), default: 0 },
    commentsOne: comments,
    commentsTwo: comments,
    commentsThree: comments,
    createdAt: { type: Date, required: true, default: Date.now() },
});
export const NewPost = mongoose.model('NewPost', Posts);
