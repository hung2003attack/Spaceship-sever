import mongoose from 'mongoose';
const slug = require('mongoose-slug-generator');
import mongooseDelete from 'mongoose-delete';

const Schema = mongoose.Schema;

const Course = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String },
        videoID: { type: String, required: true },
        lever: { type: String },
        slug: { type: String, slug: 'name', unique: true },
    },
    {
        timestamps: true,
    },
);
mongoose.plugin(slug);
Course.plugin(mongooseDelete, { deletedAt: true, overreMethods: 'all' });
module.exports = mongoose.model('Course', Course);
