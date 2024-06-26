const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true },
    password: { type: String, required: true },
    tempPassword: { type: String } // Temporarily store generated password before hashing
}, { timestamps: true });

// Hash password before saving
// userSchema.pre('save', async function (next) {
//     const user = this;
//     if (!user.isModified('password')) {
//         return next();
//     }
//     try {
//         const hashedPassword = await bcrypt.hash(user.password, 10);
//         user.password = hashedPassword;
//         // Clear tempPassword after hashing
//         user.tempPassword = undefined;
//         return next();
//     } catch (error) {
//         return next(error);
//     }
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
