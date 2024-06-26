
// const express = require('express');
// const router = express.Router();
// const Video = require('../models/uploadvideo.model');
// const upload = require('../middleware/upload');
// const verifyToken = require('../middleware/auth'); // Import your authentication middleware
// const fs = require('fs');

// router.post('/upload', verifyToken, upload.fields([
//     { name: 'thumbnail', maxCount: 1 },
//     { name: 'video', maxCount: 1 }
// ]), async (req, res) => {
//     try {
//         const { title, description } = req.body;
//         const thumbnail = req.files['thumbnail'][0].path;
//         const videoUrl = req.files['video'][0].path;

//         // Create a new Video instance with user _id populated from req.user
//         const newVideo = new Video({
//             user: req.user.id, // Ensure req.user._id is correctly set by the authentication middleware
//             title,
//             description,
//             thumbnail,
//             videoUrl
//         });
//         console.log(newVideo.user);

//         const savedVideo = await newVideo.save();

//         res.status(201).json({ message: 'Video uploaded successfully', video: savedVideo });
//     } catch (error) {
//         console.error('Error uploading video:', error);
//         // Delete uploaded files if needed
//         if (req.files['thumbnail']) {
//             fs.unlinkSync(req.files['thumbnail'][0].path);
//         }
//         if (req.files['video']) {
//             fs.unlinkSync(req.files['video'][0].path);
//         }
//         res.status(500).json({ error: 'An error occurred while uploading video' });
//     }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/auth');
const { uploadVideo } = require('../controller/uploadvideo.controller');

// POST endpoint to upload video with authentication middleware applied
router.post('/upload', verifyToken, upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), uploadVideo);

module.exports = router;
