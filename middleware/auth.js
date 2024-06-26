// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).json({ error: 'Access denied. Token not provided' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         req.user = decoded.user; 
//         next();
//     } catch (error) {
//         res.status(401).json({ error: 'Invalid token' });
//     }
// };

// module.exports = verifyToken;



// middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user; // Set req.user with the decoded user information
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;
