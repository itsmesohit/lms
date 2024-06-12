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


const addreviews = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    // console.log(req.body);
    // console.log("rating", rating);
    // console.log("comment", comment);
    const courseId = req.params.id;

    // Making a review
    const review = {
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
        rating: Number(rating),
        comment,
    };

    // First, check which course we have to add the review
    const course = await Course.findById(courseId);

    // If the course is not found, return an error response
    if (!course) {
        return res.status(404).json(new ApiResponse(404, null, "Course not found"));
    }

    // Check if this user has already made a review
    let AlreadyReview;
    if (course.reviews.length > 0) {
        AlreadyReview = course.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString()
        );
    }

    // Check condition
    if (AlreadyReview) {
        // Update the existing review of the user
        course.reviews.forEach((review) => {
            // Check which user has already made a review
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        // If the user has not reviewed in the past, add a new review
        course.reviews.push(review);
        course.reviewsCount = course.reviews.length;
    }

    // Adjust ratings (total number of ratings divided by the number of reviews)
    course.ratings = (course.reviews.reduce((acc, item) => item.rating + acc, 0) / course.reviews.length).toFixed(1);

    // Save the review
    await course.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, course, "Review added successfully!!"));
});

const deleteReview = asyncHandler(async (req, res) => {
    const courseId = req.params.id;
    const userId = req.user._id;


    const course = await Course.findById(courseId);

    console.log("course :", course);

    if (!course) {
        return res.status(404).json(new ApiResponse(404, null, "Course not found"));
    }

    // Filter out the review of the logged-in user
    const reviews = course.reviews.filter(
        (rev) => rev.user.toString() !== userId.toString()
    );

    // Update the reviews count
    const numberOfReviews = reviews.length;

    // Calculate the new ratings based on the updated reviews
    const ratings = reviews.length > 0
        ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
        : 0;

    // Update the course with the new reviews and ratings
    course.reviews = reviews;
    course.reviewsCount = numberOfReviews;
    course.ratings = ratings;

    // Save the updated 
    await course.save({ validateBeforeSave: false });

    // Return the updated course information
    return res.status(200).json(new ApiResponse(200, course, "Review deleted successfully!!"));
});

const getOnlyReviewsForOneCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)
    return res.status(200).json(new ApiResponse(200, course.reviews, "ALL review get for particular course"))

})


const adminGetSingleCourse = asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        throw new Error("Invalid course id !!")
    }
    const course = await Course.findById(req.params.id);

    return res.status(200).json(new ApiResponse(200, course, "get a course successfully"))
})

//doubt
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
    adminDeleteSingleCourse,
    addreviews, deleteReview,
    getOnlyReviewsForOneCourse
};