const mongoose = require('mongoose')
const videoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    title: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String, required: true },
    videoUrl: { type: String, required: true },
    dp: { type: String, required: true }, // Assuming 'dp' is the fieldname for profile picture in your Video model
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
