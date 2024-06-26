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



// Course Schema
const courseSchema = new mongoose.Schema(
    {

        title: {
            type: String,
            required: [true, "Course title is required"]
        },
        description: {
            type: String,
            required: [true, "Description is required"]
        },
        instructor: instructorSchema,
        modules: [moduleSchema],
        price: {
            amount: {
                type: Number,
                //required: true
            },
            currency: {
                type: String,
                //required: true
            }
        },
        duration: {
            type: String,
            required: [true, "Duration is required"]
        },
        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner",
            //required: [true, "Level is required"]
        },
        tags: [String],
        ratings: {
            type: Number,
            default: 0
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                name: {
                    type: String,
                    required: true
                },
                email: {
                    type: String,
                    required: true
                },
                rating: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5
                },
                comment: {
                    type: String,
                    required: true
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        reviewsCount: {
            type: Number,
            default: 0
        },
        enrollmentCount: {
            type: Number,
            default: 0
        },
        published: {
            type: Boolean,
            default: false
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Course', courseSchema);
