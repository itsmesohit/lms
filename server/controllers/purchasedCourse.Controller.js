const User = require("../models/user.Models")
const PurchasedCourse = require("../models/purchasedCourse.Model")
const Course = require("../models/course.Model")
const asyncHandler = require("../utills/asyncHandler")
const ApiResponse = require("../utills/apiResponse")


const createPurchasedCourse = asyncHandler(async (req, res) => {

    const { purchasedCourseInfo, paymentInfo, totalAmount } = req.body


    const purchasedCourse = await PurchasedCourse.create({
        purchasedCourseInfo,
        paymentInfo,
        totalAmount,
        user: req.user._id
    });
    //update Course Enrollment 
    //console.log("purchasedCourse :", purchasedCourseInfo);
    console.log("purchasedCourseInfoId :", purchasedCourse.purchasedCourseInfo[0].course)

    purchasedCourseInfo.forEach(async item => {
        updateCourseEnrolledCount(item.course, item.purchasedCount);
    });


    return res.status(201).json(new ApiResponse(201, purchasedCourse, "purchased course created !!"))
})

const getOnePurchasedCourse = asyncHandler(async (req, res) => {
    const purchasedCourse = await PurchasedCourse.findById(req.params.id).populate('user', 'username fullName email')
    if (!purchasedCourse) {
        throw new Error("purchased Course is not exist !!")
    }

    return res.status(200).json(new ApiResponse(200, purchasedCourse, "get purchased Course Successfully !!"))
})

const getLoggedInUserCourse = asyncHandler(async (req, res) => {
    const purchasedCourses = await PurchasedCourse.find({ user: req.user._id })
    if (!purchasedCourses) {
        throw new Error("no courses are purchased !!")
    }

    return res.status(200).json(new ApiResponse(200, purchasedCourses, "get All purchased Courses of logged in user !!"))
})

const adminGetAllCoursesPurchased = asyncHandler(async (req, res) => {
    const purchasedCourses = await PurchasedCourse.find();
    return res.status(200).json(new ApiResponse(200, purchasedCourses, "Get all purchases courses succefully !!"))
})



async function updateCourseEnrolledCount(courseId, purchasedCount) {
    const course = await Course.findById(courseId)
    //console.log("course : ", course);
    course.enrollmentCount = course.enrollmentCount + purchasedCount

    await course.save({ validateBeforeSave: false });
}

module.exports = {
    createPurchasedCourse, getOnePurchasedCourse,
    getLoggedInUserCourse, adminGetAllCoursesPurchased,

}