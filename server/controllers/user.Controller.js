const { Error } = require("mongoose");
const asyncHandler = require("../utills/asyncHandler")
const validator = require("validator");
const User = require("../models/user.Models");
const { uploadImageOnCloudinary, deleteImageOnCloudinary } = require("../utills/cloduinary");
const ApiResponse = require("../utills/apiResponse");
const jwt = require("jsonwebtoken");
const mailHelper = require("../utills/emailHelper");
const crypto = require("crypto");


const generateAccessAndResfreshToken = async (userId) => {
    try {

        const user = await User.findById(userId);
        const accessToken = user.generateAccesToken()
        const refreshToken = user.generateResfreshToken();

        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken };

    } catch (error) {

        throw Error("Something went wrong during generating tokens !!")

    }
}
const isPasswordValidlength = (password) => {
    const minLength = 8;
    return password.length >= minLength
};

const registerUser = asyncHandler(async (req, res) => {
    //1.take a data from fontend
    //2.validate data
    //3.if already user exist or not
    //4. check image validation and upload in cloud
    //5.create user object 
    //6.remove password and refreshtoken field
    //7/user created
    //8.return response

    const { username, fullName, password, email, gender } = req.body;

    console.log("username :", username);

    if (!username || !fullName || !password || !email || !gender) {
        throw new Error("All fields are required !!");
    }

    // if (!isNameValid(fullName)) {
    //     throw Error("FullName contains atleast 5 characters !");
    // }

    if (!validator.isEmail(email)) {
        throw new Error("Email is invalid !!");
    }

    if (!isPasswordValidlength(password)) {
        throw new Error("Password must contain 8 characters !!");
    }

    if (!req.file) {
        throw new Error("Avatar image is missing !!");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new Error("User is already existed !!");
    }

    const avatarLocalPath = req.file.path;

    console.log(avatarLocalPath);

    let avatar;

    if (avatarLocalPath) {
        avatar = await uploadImageOnCloudinary(avatarLocalPath);
        console.log("avatar", avatar);
    } else {
        throw new Error("Avatar file is missing !!");
    }

    if (!avatar) {
        throw new Error("Error during file uploading !!");
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullName,
        email,
        password,
        gender,
        avatar: avatar.secure_url
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new Error("Something went wrong during registering user !!");
    }

    //account verfication login 
    const verifyToken = createdUser.getVerificationToken();

    await createdUser.save({ validateBeforeSave: false });

    const url = `${req.protocol}://${req.get("host")}/api/user/verify-account/${verifyToken}`;

    const message = `Click here to verify your account  \n\n <a></a>${url}`;

    try {
        await mailHelper({
            email: createdUser.email,
            subject: "CODING_SPARK ---> Account Verification",
            message
        });

        return res.status(200).json(new ApiResponse(200, {}, "Account verification mail sent successfully !!"));

    } catch (error) {
        // Log the error details
        console.error("Error sending email:", error);

        // Reset the user's password token fields if email sending fails
        createdUser.verificationAccountToken = undefined;
        createdUser.verificationAccountExpiry = undefined;
        await createdUser.save({ validateBeforeSave: false });

        throw new Error(`Error sending email: ${error.message}`);
    }

    // return res.status(201).json(
    //     new ApiResponse(201, createdUser, "User registered successfully !!")
    // // );
});

const accountVerify = asyncHandler(async (req, res, next) => {
    try {
        const token = req.params.token;

        const encryptedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            verificationAccountToken: encryptedToken,
            verificationAccountExpiry: { $gt: Date.now() }
        });

        console.log(user);
        if (!user) {
            throw new Error('Token is invalid or expired');
        }

        if (user.isVerified == false) {
            user.isVerified = true
        }


        user.verificationAccountExpiry = undefined;
        user.verificationAccountToken = undefined;

        await user.save();

        return res.status(201).json(new ApiResponse(201, {}, "User verified Successfully !!"));

    } catch (error) {
        console.error("Error resetting password:", error);
        throw new Error(error.message)
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log("Request Body in loginUser:", req.body);

    if (!email || !password) {
        throw new Error("Email or Password is missing !!");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found !!");
    }

    const isCorrect = await user.isPasswordCorrect(password);

    if (!isCorrect) {
        throw new Error("Invalid User credentials !!");
    }

    const { accessToken, refreshToken } = await generateAccessAndResfreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User Logged In successfully !!"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1//
        }
    }, {
        new: true
    })

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User LogOut Successfully !!"))
})

const refreshedAccessToken = asyncHandler(async (req, res) => {

    const inocmingRefreshtoken = req.cookies.refreshToken || req.body.refreshToken

    if (!inocmingRefreshtoken) {
        throw new Error(401, 'Unauthorized request !')
    }

    try {
        const decodedToken = jwt.verify(inocmingRefreshtoken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new Error(401, "Invalid refresh token !")
        }

        if (inocmingRefreshtoken !== user?.refreshToken) {
            throw new Error(401, "Refresh token is expired or used !")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken: accessNewToken, refreshToken: refreshNewToken } = await generateAccessAndResfreshToken(user._id)
        if (!accessNewToken || !refreshNewToken) {
            throw new Error("Failed to generate new tokens.");
        }

        // console.log("access", accessNewToken);
        // console.log("refresh", refreshNewToken);

        return res
            .status(200)
            .cookie("accessToken", accessNewToken, options)
            .cookie("refreshToken", refreshNewToken, options)
            .json(new ApiResponse(200, {
                accessToken: accessNewToken,
                refreshToken: refreshNewToken
            }, "Access token refreshed successfully !!"));




    } catch (error) {

        throw new Error("Invalid refresh Token !!")
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword, confirmPassword } = req.body

    if (newPassword !== confirmPassword) {
        throw new Error("New Password and confirm Password not matched !!")
    }
    const user = await User.findById(req.user?._id)
    const isRight = await user.isPasswordCorrect(oldPassword)

    if (!isRight) {
        throw new Error("Invalid old Password !!");
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })


    return res.status(200).json(new ApiResponse(200, {}, "Password Changed Succesfully !!"))

})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;
    if (!fullName || !email) {
        throw new Error("All fields are required!!")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {
            new: true
        }

    ).select("-password -refreshToken");


    return res.status(200).json(new ApiResponse(200, user, "Account Details Update Successfully !!"))


})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(404, "Avatar file is missing !!");
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found !!");
    }

    const oldAvatarImage = user.avatar;
    const deleteResult = await deleteImageOnCloudinary(oldAvatarImage);

    if (deleteResult.result !== 'ok' && deleteResult.result !== 'not found') {
        console.error("Failed to delete old avatar image from Cloudinary:", deleteResult);
        return res.status(500).json(new ApiResponse(500, "Unable to delete the old avatar from Cloudinary !!"));
    }

    const avatar = await uploadImageOnCloudinary(avatarLocalPath);

    if (!avatar.secure_url) {
        throw new ApiError(404, "Error while uploading the new avatar !!");
    }

    user.avatar = avatar.secure_url;
    await user.save();

    return res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully !!"));
});

const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    console.log(email);
    // Ensure email is provided
    if (!email) {
        throw new Error("Email is required !!");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found !!");
    }

    const forgetToken = user.getForgotPasswordToken();

    await user.save({ validateBeforeSave: false });

    const url = `${req.protocol}://${req.get("host")}/api/user/password/reset/${forgetToken}`;

    const message = `Click here to reset password \n\n <a></a>${url}`;

    try {
        await mailHelper({
            email: user.email,
            subject: "CODING_SPARK ---> Password Reset Email",
            message
        });

        return res.status(200).json(new ApiResponse(200, {}, "Email sent successfully !!"));

    } catch (error) {
        // Log the error details
        console.error("Error sending email:", error);

        // Reset the user's password token fields if email sending fails
        user.forgetPasswordToken = undefined;
        user.forgetPasswordExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        throw new Error(`Error sending email: ${error.message}`);
    }
});

const resetPassword = asyncHandler(async (req, res, next) => {
    try {
        const token = req.params.token;

        const encryptedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            forgetPasswordToken: encryptedToken,
            forgetPasswordExpiry: { $gt: Date.now() }
        });

        console.log(user);
        if (!user) {
            throw new Error('Token is invalid or expired');
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            throw new Error('Password and confirm password do not match');
        }

        user.password = req.body.newPassword;
        user.forgetPasswordExpiry = undefined;
        user.forgetPasswordToken = undefined;

        await user.save();

        return res.status(201).json(new ApiResponse(201, {}, "Password Reset Successfully, Login with new Password !!"));

    } catch (error) {
        console.error("Error resetting password:", error);
        throw new Error(error.message)
    }
});

const userDashboard = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) {
        throw new Error("User not found !!")
    }
    res.status(200).json({
        success: true,
        user,
    })
})

const adminGetAllUser = asyncHandler(async (req, res) => {
    const users = await User.find()

    res.status(200).json(new ApiResponse(200, users, "Get all Users Successfully !!"))
})

const adminGetSingleUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        throw new Error("user not found !!")
    }
    res.status(200).json(new ApiResponse(200, user, "User get successfully !!"))
})

const adminUpdateUser = asyncHandler(async (req, res) => {
    const newData = {

        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    await user.save()

    res.status(200).json(new ApiResponse(200, user, "Updated Succesffully!!"))
})

const adminDeleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        throw new Error("User not exist !!");
    }
    const cloudinary_url = user.avatar;
    const deleteResult = await deleteImageOnCloudinary(cloudinary_url)
    if (deleteResult.result !== 'ok') {
        console.error("Failed to delete avatar image from Cloudinary:", deleteResult);
        return res.status(500).json(new ApiResponse(500, {}, "Unable to delete the old coverImage form cloudinary !!"));
    }
    await user.deleteOne()

    return res.status(200).json(new ApiResponse(200, {}, "User deleted Successfully !!"))
})


const loadAuth = (req, res) => {
    res.render('auth');
}

const successGoogleLogin = (req, res) => {
    if (!req.user) {
        res.redirect('failure');
    }
    console.log(req.user);
    res.send("Welcome " + req.user.email);
}

const failureGoogleLogin = (req, res) => {
    res.send("Error");
}



module.exports = {
    registerUser, loginUser, logoutUser, refreshedAccessToken, changeCurrentPassword,
    updateAccountDetails, updateUserAvatar, forgetPassword, resetPassword, accountVerify,
    userDashboard, adminGetAllUser, adminGetSingleUser, adminUpdateUser, adminDeleteUser,
    successGoogleLogin, failureGoogleLogin, loadAuth
}