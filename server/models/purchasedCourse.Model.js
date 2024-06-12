const mongoose = require('mongoose');
const purchasedCourseSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    purchasedCourseInfo: [
        {
            title: {
                type: String,
                //required: true
            },
            purchasedCount: {
                type: Number,
                //required: true,
            },
            price: {
                type: Number,
                //required: true,
            },
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
                //required: true
            }
        }

    ],
    paymentInfo: {
        id: {
            type: String
        }
    },
    totalAmount: {
        type: Number,
        required: true
    }

}, { timestamps: true });



module.exports = mongoose.model("PurchasedCourse", purchasedCourseSchema);