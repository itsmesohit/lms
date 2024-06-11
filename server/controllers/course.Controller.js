const Course = require("../models/course.Model");
const User = require("../models/user.Models");
const Instructor = require("../models/instructor.Model");
const asyncHandler = require("../utills/asyncHandler");
const ApiResponse = require("../utills/apiResponse");
const { isValidObjectId } = require("mongoose");

const createCourse = asyncHandler(async (req, res) => {

    console.log(req.body)

    // req.body.user = req.user.id
    const { instructorId } = req.body
    const { title, description, price, duration, level, tags } = req.body;


    const instructor = await Instructor.findById(instructorId)
    if (!instructor) {
        throw new Error("instructor is not exist !!")
    }

    const course = await Course.create({
        instructor: {
            name: instructor.name,
            email: instructor.email,
            bio: instructor.bio,
            linkdenProfile: instructor.linkdenProfile,
            profilePicture: instructor.profilePicture
        },
        title,
        description,
        price,
        duration,
        level,
        tags,
        user: req.user.id
    })

    await course.save();

    const courseObj = course.toObject();

    return res.status(201).json({
        status: "true",
        message: "course created",
        courseObj,
    })

});

const getAllCourse = asyncHandler(async (req, res) => {
    const courses = await Course.find()

    const coursesObj = courses.map(course => course.toObject());

    return res.status(200).json(new ApiResponse(200, coursesObj, "All courses fetched !!"))
});

const getSingleCourse = asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        throw new Error("Invalid course id !!")
    }
    const course = await Course.findById(req.params.id);

    return res.status(200).json(new ApiResponse(200, course, "get a course successfully"))
})


const adminGetSingleCourse = asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        throw new Error("Invalid course id !!")
    }
    const course = await Course.findById(req.params.id);

    return res.status(200).json(new ApiResponse(200, course, "get a course successfully"))
})

const adminUpdateSingleCourse = asyncHandler(async (req, res) => {

    //we will update this controller function when we have a poster of course

    if (!isValidObjectId(req.params.id)) {
        throw new Error("course id is not valid !!")
    }
    //it is not a correct approach !! I have to discuss with sir
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: false,
        useFindAndModify: false
    });

    return res.status(200).json(new ApiResponse(200, course, "SuccessFully Updated !!"))






})

const adminDeleteSingleCourse = asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        throw new Error("Invalid course id")
    }

    const course = await Course.findByIdAndDelete(req.params.id);
    return res.status(200).json(new ApiResponse(200, {}, "Deleted Successfully !"))
})












module.exports = {
    createCourse, getAllCourse,
    getSingleCourse,
    adminUpdateSingleCourse,
    adminGetSingleCourse,
    adminDeleteSingleCourse
};