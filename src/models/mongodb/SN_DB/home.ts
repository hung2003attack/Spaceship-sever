import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const feel = {
    like: { act: { type: Number, maxLength: 10, defaultValue: 0 }, id_user: [String] },
    love: { act: { type: Number, maxLength: 10, defaultValue: 0 }, id_user: [String] },
    smile: { act: { type: Number, maxLength: 10, defaultValue: 0 }, id_user: [String] },
    sad: { act: { type: Number, maxLength: 10, defaultValue: 0 }, id_user: [String] },
};
const comments = [
    {
        id_user: {
            type: String,
            required: true,
            maxLength: 50,
        },
        content: {
            text: { type: String, text: String },
            imageOrVideos: [{ file: { type: String, maxLength: 50 }, feel }],
        },
        feel,
        reply: [
            {
                id_user: { type: String, maxLength: 50, required: true },
                content: { text: { type: String, text: String }, imageOrVideos: [String] },
                feel,
                private: { type: Boolean, defaultValue: false },
            },
        ],
        private: { type: Boolean, defaultValue: false },
    },
];
const Posts = new Schema({
    id_user: { type: String, maxLength: 50, required: true },
    type: { type: Number, maxLength: 1 },
    content: {
        text: { type: String, text: String },
        imageOrVideos: [
            {
                file: { type: String, maxLength: 50 },
                title: { type: String, maxLength: 100 },
                love: { act: { type: Number, maxLength: 11, defaultValue: 0 }, id_user: [String] },
                comments,
                options: { Bgcolors: { type: String, maxLength: 10 }, column: { type: Number, maxLength: 2 } },
            },
        ],
    },
    feel,
    amountComments: { type: Number, maxLength: 11, default: 0 },
    commentsOne: comments,
    commentsTwo: comments,
    commentsThree: comments,
    private: { type: Boolean, defaultValue: false },
    createdAt: { type: Date, required: true, default: Date.now() },
});
export const NewPost = mongoose.model('NewPost', Posts);
