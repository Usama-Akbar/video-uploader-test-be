// models/uploadvideo.model.js

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    title: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String, required: true },
    videoUrl: { type: String, required: true }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
