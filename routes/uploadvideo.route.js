const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/auth');
const { uploadVideo, getAllVideosByUser,AllVideosByUser, deleteVideo,updateVideo } = require('../controller/uploadvideo.controller');

// POST endpoint to upload video with authentication middleware applied
router.post('/upload', verifyToken, upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'dp', maxCount: 1 }
]), uploadVideo);


router.get('/allVideo', verifyToken, getAllVideosByUser);
router.delete('/delete/:id',verifyToken,deleteVideo);

router.put('/update/:videoId', verifyToken, upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'dp', maxCount: 1 } 

]), updateVideo);

//get all user with videos
router.get('/users-with-videos',verifyToken,AllVideosByUser)

module.exports = router;
