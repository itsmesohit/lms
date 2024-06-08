const { Error } = require("mongoose");
const asyncHandler = require("../utills/asyncHandler")
const validator = require("validator");
const User = require("../models/user.Models");
const { uploadImageOnCloudinary } = require("../utills/cloduinary");
const ApiResponse = require("../utills/apiResponse");




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
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/g;
    // const hasNumber = /[0-9]/g;
    // const hasAlphabet = /[A-Za-z]/g;
    return password.length >= minLength
    // && hasSpecialChar.test(password) && hasNumber.test(password) && hasAlphabet.test(password);
};
const isPasswordHasSpecialCharacter = (password) => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/g;
    return hasSpecialChar.test(password);
}
const isPasswordHasAlphabet = (password) => {
    const hasAlphabet = /[A-Za-z]/g;
    return hasAlphabet.test(password);
}
const isPasswordHasNumber = (password) => {
    const hasNumber = /[0-9]/g;
    return hasNumber.test(password);
}

const isNameValid = (name) => {
    const minLength = 5;
    return name.length >= minLength
}


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

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully !!")
    );
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw Error("Email or Password is missing !!")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw Error("User not found !!")
    }

    const isCorrect = await user.isPasswordCorrect(password)

    if (!isCorrect) {
        throw Error("Invalid User credentials !!")
    }

    const { accessToken, refreshToken } = await generateAccessAndResfreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cokie("accesToken", accessToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User Logged In successfully !!"
            )
        )
})


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


module.exports = { registerUser, loginUser, logoutUser }