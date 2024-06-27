const Video = require('../models/uploadvideo.model');
const User = require('../models/user.model')
const fs = require('fs');
const path = require('path');

const uploadVideo = async (req, res) => {
    try {
        const { title, description } = req.body;
        if(!title || !description){
            return res.status(404).json({"error":"Please fill out all the fields"})
        }
        const thumbnailPath = req.files['thumbnail'][0].path;
        const videoPath = req.files['video'][0].path;
        const dpPath = req.files['dp'][0].path; // Assuming 'dp' is the fieldname for profile picture

        const serverPort = process.env.PORT || 4000;

        const thumbnailUrl = `http://localhost:${serverPort}/${thumbnailPath.replace('\\', '/')}`;
        const videoUrl = `http://localhost:${serverPort}/${videoPath.replace('\\', '/')}`;
        const dpUrl = `http://localhost:${serverPort}/${dpPath.replace('\\', '/')}`;

        const newVideo = new Video({
            user: req.user.id,
            title,
            description,
            thumbnail: thumbnailUrl,
            videoUrl,
            dp: dpUrl 
        });

        const savedVideo = await newVideo.save();

        res.status(201).json({ message: 'Video uploaded successfully', video: savedVideo });
    } catch (error) {
        console.error('Error uploading video:', error);
        if (req.files['thumbnail']) {
            fs.unlinkSync(req.files['thumbnail'][0].path);
        }
        if (req.files['video']) {
            fs.unlinkSync(req.files['video'][0].path);
        }
        if (req.files['dp']) {
            fs.unlinkSync(req.files['dp'][0].path);
        }
        res.status(500).json({ error: 'An error occurred while uploading video' });
    }
};


//get all videos
const getAllVideosByUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const videos = await Video.find({ user: userId });

        res.status(200).json({ videos });
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'An error occurred while fetching videos' });
    }
};

//delete Vidoe Uploads

const deleteVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.id;

        const video = await Video.findOne({ _id: videoId, user: userId });

        if (!video) {
            return res.status(404).json({ error: 'Video not found or you do not have permission to delete it' });
        }

        // Delete the video files
        const thumbnailPath = path.join(__dirname, '..', video.thumbnail.replace('http://localhost:4000/', ''));
        const videoUrlPath = path.join(__dirname, '..', video.videoUrl.replace('http://localhost:4000/', ''));

        if (fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
        } else {
            console.warn(`Thumbnail file not found: ${thumbnailPath}`);
        }

        if (fs.existsSync(videoUrlPath)) {
            fs.unlinkSync(videoUrlPath);
        } else {
            console.warn(`Video file not found: ${videoUrlPath}`);
        }

        await Video.deleteOne({ _id: videoId });

        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ error: 'An error occurred while deleting the video' });
    }
};


//update vidoe
const updateVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { title, description } = req.body;

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        video.title = title || video.title;
        video.description = description || video.description;

        // Update thumbnail if provided
        if (req.files && req.files['thumbnail']) {
            const thumbnailPath = req.files['thumbnail'][0].path;
            const serverPort = process.env.PORT || 4000;
            const thumbnailUrl = `http://localhost:${serverPort}/${thumbnailPath.replace('\\', '/')}`;

            // Delete existing thumbnail file if it exists
            if (fs.existsSync(video.thumbnail.replace('http://localhost:4000/', ''))) {
                fs.unlinkSync(video.thumbnail.replace('http://localhost:4000/', ''));
            }

            video.thumbnail = thumbnailUrl;
        }

        // Update video if provided
        if (req.files && req.files['video']) {
            const videoPath = req.files['video'][0].path;
            const serverPort = process.env.PORT || 4000;
            const videoUrl = `http://localhost:${serverPort}/${videoPath.replace('\\', '/')}`;

            // Delete existing video file if it exists
            if (fs.existsSync(video.videoUrl.replace('http://localhost:4000/', ''))) {
                fs.unlinkSync(video.videoUrl.replace('http://localhost:4000/', ''));
            }

            video.videoUrl = videoUrl;
        }

        // Update dp (profile picture) if provided
        if (req.files && req.files['dp']) {
            const dpPath = req.files['dp'][0].path;
            const serverPort = process.env.PORT || 4000;
            const dpUrl = `http://localhost:${serverPort}/${dpPath.replace('\\', '/')}`;

            // Delete existing dp file if it exists
            if (fs.existsSync(video.dp.replace('http://localhost:4000/', ''))) {
                fs.unlinkSync(video.dp.replace('http://localhost:4000/', ''));
            }

            video.dp = dpUrl;
        }

        const updatedVideo = await video.save();

        res.status(200).json({ message: 'Video updated successfully', video: updatedVideo });
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ error: 'An error occurred while updating video' });
    }
};


//get all user with vidoes
const AllVideosByUser = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user's firstname
        const user = await User.findById(userId, 'firstname');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch videos uploaded by the user
        const videos = await Video.find({ user: userId });

        // Construct response object
        const response = {
            firstname: user.firstname,
            videos: videos.map(video => ({
                _id: video._id,
                user: video.user, // Assuming you still want to include user ID here
                title: video.title,
                description: video.description,
                thumbnail: video.thumbnail,
                videoUrl: video.videoUrl,
                dp: video.dp,
                createdAt: video.createdAt,
                updatedAt: video.updatedAt,
                __v: video.__v
            }))
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'An error occurred while fetching videos' });
    }
};




module.exports = {
    uploadVideo,
    deleteVideo,
    updateVideo,
    getAllVideosByUser,
    AllVideosByUser
};
