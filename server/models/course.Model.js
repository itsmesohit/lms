const mongoose = require('mongoose');

// Instructor Schema
const instructorSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: [true, "Instructor name is required"]
    },
    bio: {
        type: String,
        // required: [true, "Instructor bio is required"]
    },
    linkdenProfile: {
        type: String
    },
    profilePicture: {
        type: String,
        // required: [true, "Instructor profile picture is required"]
    }
});

// Question Schema
const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        //required: true
    },
    options: {
        type: [String],
        //required: true
    },
    correctOption: {
        type: String,
        //required: true
    }
});

// Lesson Schema
const lessonSchema = new mongoose.Schema({

    title: {
        type: String,
        //required: true
    },
    duration: {
        type: String,
        //required: true
    },
    videoURL: {
        type: String,
        //required: true
    },
    transcript: {
        type: String,
        //required: true
    },
    quiz: {
        questions: [questionSchema]
    }
});

// Module Schema
const moduleSchema = new mongoose.Schema({

    title: {
        type: String,
        // required: true
    },
    lessons: [lessonSchema]
});

// Review Schema
const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating: {
        type: Number,
        //required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        //required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Price Schema
const priceSchema = new mongoose.Schema({
    amount: {
        type: Number,
        //required: true
    },
    currency: {
        type: String,
        //required: true
    }
});

// Course Schema
const courseSchema = new mongoose.Schema(
    {

        title: {
            type: String,
            //required: [true, "Course title is required"]
        },
        description: {
            type: String,
            // required: [true, "Description is required"]
        },
        instructor: instructorSchema,
        modules: [moduleSchema],
        price: priceSchema,
        duration: {
            type: String,
            //required: [true, "Duration is required"]
        },
        level: {
            default: "Beginner",
            enum: ["Beginner", "Intermediate", "Advanced"]
            //required: [true, "Level is required"]
        },
        tags: [String],
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        reviews: [reviewSchema],
        enrollmentCount: {
            type: Number,
            default: 0
        },
        published: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Course', courseSchema);
