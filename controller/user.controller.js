const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Bio = require('../models/bio.model');

require('dotenv').config();

const generatePassword = (firstname, lastname, email, number) => {
    const part1 = firstname.charAt(0);
    const part2 = lastname.slice(-1);
    const part3 = email.slice(0, 4);
    const part4 = number.slice(-3);
    return `${part1}${part2}${part3}${part4}`;
};

const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, number } = req.body;

        if (!firstname || !lastname || !email || !number) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const randomPassword = generatePassword(firstname, lastname, email, number);

        // Hash the generated password
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const newUser = new User({ firstname, lastname, email, number, password: hashedPassword });
        await newUser.save();

        // Send registration email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Registration Successful',
            text: `Dear ${firstname} ${lastname},\n\nYour registration was successful. Your password is: ${randomPassword}\n\nThank you!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ error: 'An error occurred while sending email' });
            } else {
                console.log("Email sent:", info.response);
                res.status(201).json({ message: 'User registered successfully' });
            }
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: 'An error occurred while registering user' });
    }
};

const login = async (req, res) => {
    const { firstname, password } = req.body;

    try {
        const user = await User.findOne({ firstname });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user._id,
                firstname: user.firstname,
                email: user.email
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (error, token) => {
            if (error) throw error;
            res.status(200).json({ message: 'Login successful', token });
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const createBio = async (req, res) => {
    const { content } = req.body;

    try {
        const userId = req.user.id;

        const newBio = new Bio({ userId, content });
        const savedBio = await newBio.save();
        res.status(201).json({ message: 'Biography created successfully', bio: savedBio });
    } catch (error) {
        console.error('Error creating biography:', error);
        res.status(500).json({ error: 'An error occurred while creating biography' });
    }
};

module.exports = {
    registerUser,
    login,
    createBio
};
