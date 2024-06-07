const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    usernane: {
        type: String,
        required: [true, "Username is required !"],
        uniqure: [true, "Username should be unique !"],
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: [true, "Email is required !!"],
        unique: [true, "Email is already exist !"],
        trim: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: [true, "Full Name is required !!"],
    },
    avater: {
        type: String,
        required: [true, 'Avatar is required !!']
    },
    gender: {
        type: String,
        required: [true, "Gender is required !!"],
    },
    role: {
        type: String,
        required: true,
        default: 'student',
        enum: ['admin', 'instructor']
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema);