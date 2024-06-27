

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'thumbnail' && file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else if (file.fieldname === 'video' && file.mimetype === 'video/mp4') {
        cb(null, true);
    } else if (file.fieldname === 'dp' && file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG images for thumbnail, DP, and MP4 videos are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 6 * 1024 * 1024 // 6 MB limit for video file size
    },
    fileFilter: fileFilter
});

module.exports = upload;


