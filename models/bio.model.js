const mongoose = require('mongoose');

const bioSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, maxlength: 200, required: true }
}, { timestamps: true });

const Bio = mongoose.model('Bio', bioSchema);

module.exports = Bio;
