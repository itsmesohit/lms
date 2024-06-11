const mongoose = require("mongoose");
const instructorSchema = new mongoose.Schema({

    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    }
    ,
    bio: {
        type: String,
    },
    linkdenProfile: {
        type: String,
    },
    profilePicture: {
        type: String
    }

}, { timestamps: true })


module.exports = mongoose.model("Instructor", instructorSchema);