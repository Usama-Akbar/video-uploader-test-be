const express = require('express');
const cors = require('cors');
const connectToMongo = require('./utils/db');
const userRouter = require('./routes/user.route');
const videoRouter = require('./routes/uploadvideo.route'); 
const app = express();
const path = require('path');
const port = process.env.PORT || 4000; // Use the port from .env or default to 4000

app.use(express.json());
app.use(cors());

connectToMongo();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use userRouter for handling user routes
app.use('/api/users', userRouter);

// Use videoRouter for handling video upload routes
app.use('/api/uploadVideo', videoRouter);

app.get("/", (req, res) => {
    res.send("Test task of Uploader");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
