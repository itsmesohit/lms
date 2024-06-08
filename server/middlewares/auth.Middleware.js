const { Error } = require("mongoose");
const asyncHandler = require("../utills/asyncHandler")
const validator = require("validator");
const User = require("../models/user.Models");
const ApiResponse = require("../utills/apiResponse");


const verifyJWT = asyncHandler(async (req, res, next) => {

    try {

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw Error("Unauthorized Request !!")
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

        if (!user) {
            throw Error("Invalid User !!")
        }

        req.user = user;
        next()

    } catch (error) {
        throw ApiError("Invalid access Token !!")
    }
})

module.exports = verifyJWT