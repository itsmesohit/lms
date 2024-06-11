const Course = require("../models/course.Model")
const User = require("../models/user.Models")
const asyncHandler = require("../utills/asyncHandler")
const ApiResponse = require("../utills/apiResponse")

const createCourse = asyncHandler(async (req, res) => {
    const { title, description, instructorId, module, price, duration, level, tags } = req.body;

    const instructor = await User.findById(instructorId);
    if (!instructor) {
        throw new Error("Instructor is not exist !!")
    }


})