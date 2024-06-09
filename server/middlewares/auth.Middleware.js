const { Error } = require("mongoose");
const asyncHandler = require("../utills/asyncHandler")
const User = require("../models/user.Models");
const ApiResponse = require("../utills/apiResponse");
const jwt = require("jsonwebtoken");


const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("Token:", token);

        if (!token) {
            throw new Error("Unauthorized Request !!");
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        //console.log("Decoded Token:", decodeToken);

        const user = await User.findById(decodeToken?._id).select("-password -refreshToken");
        // console.log("User:", user);

        if (!user) {
            throw new Error("Invalid User !!");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        throw new Error("Invalid Token !!");
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {

    if (req.user.role !== "admin") {
        throw new Error("Unauthorized Access !!")
    }

    next();
})

module.exports = {
    verifyJWT, isAdmin
}