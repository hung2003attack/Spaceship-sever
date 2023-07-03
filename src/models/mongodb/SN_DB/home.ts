import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const feel = {
    like: { act: { type: Number(11), defaultValue: 0 }, id_user: [String(50)] },
    love: { act: { type: Number(11), defaultValue: 0 }, id_user: [String(50)] },
    smile: { act: { type: Number(11), defaultValue: 0 }, id_user: [String(50)] },
    sad: { act: { type: Number(11), defaultValue: 0 }, id_user: [String(50)] },
};
const comments = [
    {
        id_user: { type: String(50), required: true },
        content: {
            text: { type: String, text: String },
            imageOrVideos: [{ file: { type: String(50) }, feel }],
        },
        feel,
        reply: [
            {
                id_user: { type: String(50), required: true },
                content: { text: { type: String, text: String }, imageOrVideos: [String(50)] },
                feel,
                private: { type: Boolean, defaultValue: false },
            },
        ],
        private: { type: Boolean, defaultValue: false },
    },
];
const Posts = new Schema({
    id_user: { type: String(50), required: true },
    type: { type: Number(1) },
    content: {
        text: { type: String, text: String },
        imageOrVideos: [
            {
                file: { type: String(50) },
                love: { act: { type: Number(11), defaultValue: 0 }, id_user: [String(50)] },
                comments,
                options: { title: { type: String(100) }, Bgcolors: { type: String(10) }, column: { type: Number(2) } },
            },
        ],
    },
    feel,
    amountComments: { type: Number(11), default: 0 },
    commentsOne: comments,
    commentsTwo: comments,
    commentsThree: comments,
    private: { type: Boolean, defaultValue: false },
    createdAt: { type: Date, required: true, default: Date.now() },
});
export const NewPost = mongoose.model('NewPost', Posts);
