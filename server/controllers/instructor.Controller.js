const Instructor = require("../models/instructor.Model");
const ApiResponse = require("../utills/apiResponse");
const asyncHandler = require("../utills/asyncHandler");
const { uploadImageOnCloudinary } = require("../utills/cloduinary");

const createInstructor = asyncHandler(async (req, res) => {

    const { name, email, bio, linkdenProfile } = req.body

    if (!name) {
        throw new Error("name is missing !!")
    }
    else if (!bio) {
        throw new Error("bio is missing !!")

    } else if (!linkdenProfile) {
        throw new Error("Linkden profile is missing !!")
    }
    else if (!email) {
        throw new Error("Email is missing !")
    }

    if (!req.file) {
        throw new Error("Profile image is missing !!");
    }

    const existedInstructor = await Instructor.findOne({ email });



    if (existedInstructor) {
        throw new Error("Instructor is already existed !!");
    }

    const profileLocalPath = req.file.path;

    console.log(profileLocalPath);

    let profile;

    if (profileLocalPath) {
        profile = await uploadImageOnCloudinary(profileLocalPath);
        console.log("profile :", profile);
    } else {
        throw new Error("profile file is missing !!");
    }

    if (!profile) {
        throw new Error("Error during file uploading !!");
    }

    const instructor = await Instructor.create({
        name,
        bio,
        email,
        linkdenProfile,
        profilePicture: profile.secure_url

    });

    await instructor.save();

    return res.status(201).json(new ApiResponse(201, instructor, "Instructor is created!!"))
})


module.exports = { createInstructor }