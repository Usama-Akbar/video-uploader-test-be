// const Video = require('../models/uploadvideo.model');
// const fs = require('fs');

// const uploadVideo = async (req, res) => {
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
// };

// module.exports = {
//     uploadVideo
// };




//



const Video = require('../models/uploadvideo.model');
const fs = require('fs');
const path = require('path');

const uploadVideo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const thumbnailPath = req.files['thumbnail'][0].path;
        const videoPath = req.files['video'][0].path;

        // Get server port (assuming it's stored in environment variables or directly known)
        const serverPort = process.env.PORT || 4000; // Replace with your server's actual port

        // Create complete URLs for thumbnail and videoUrl
        const thumbnailUrl = `http://localhost:${serverPort}/${thumbnailPath.replace('\\', '/')}`;
        const videoUrl = `http://localhost:${serverPort}/${videoPath.replace('\\', '/')}`;

        // Create a new Video instance with user _id populated from req.user
        const newVideo = new Video({
            user: req.user.id, // Ensure req.user._id is correctly set by the authentication middleware
            title,
            description,
            thumbnail: thumbnailUrl,
            videoUrl
        });

        const savedVideo = await newVideo.save();

        res.status(201).json({ message: 'Video uploaded successfully', video: savedVideo });
    } catch (error) {
        console.error('Error uploading video:', error);
        // Delete uploaded files if needed
        if (req.files['thumbnail']) {
            fs.unlinkSync(req.files['thumbnail'][0].path);
        }
        if (req.files['video']) {
            fs.unlinkSync(req.files['video'][0].path);
        }
        res.status(500).json({ error: 'An error occurred while uploading video' });
    }
};

module.exports = {
    uploadVideo
};
