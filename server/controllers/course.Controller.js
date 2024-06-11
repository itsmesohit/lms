const Course = require("../models/course.Model");
const User = require("../models/user.Models");
const Instructor = require("../models/instructor.Model");
const asyncHandler = require("../utills/asyncHandler");
const ApiResponse = require("../utills/apiResponse");

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

module.exports = { createCourse, getAllCourse };