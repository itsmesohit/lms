const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        //required: [true, "Username is required !"],
        unique: [true, "Username should be unique !"],
        trim: true,
    },
    googleId: String,
    email: {
        type: String,
        //required: [true, "Email is required !!"],
        // unique: [true, "Email is already exist !"],
        trim: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        //required: [true, "Full Name is required !!"],
    },
    avatar: {
        type: String,
        // required: [true, 'Avatar is required !!']
    },
    gender: {
        type: String,
        // required: [true, "Gender is required !!"],
    },
    role: {
        type: String,
        default: 'student',
        enum: ['admin', 'instructor', 'student']
    },
    password: {
        type: String,
        // required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    },
    profileVerificationToken: String,
    profileVerifcationExpiry: Date,
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,
    verificationAccountToken: String,
    verificationAccountExpiry: Date
}, { timestamps: true })


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccesToken = function () {
    return jwt.sign({
        //payload
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateResfreshToken = function () {
    return jwt.sign(
        {
            //payload
            _id: this._id,


        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

//generate forget password string
userSchema.methods.getForgotPasswordToken = function () {
    const forgetPasswordToken = crypto.randomBytes(20).toString('hex');

    //getting a hash 
    this.forgetPasswordToken = crypto.createHash('sha256').update(forgetPasswordToken).digest('hex')

    //expiry
    this.forgetPasswordExpiry = Date.now() + 30 * 60 * 1000

    return forgetPasswordToken;
}

//generate verification
userSchema.methods.getVerificationToken = function () {
    const verificationToken = crypto.randomBytes(20).toString('hex');

    //getting a hash 
    this.verificationAccountToken = crypto.createHash('sha256').update(verificationToken).digest('hex')

    //expiry
    this.verificationAccountExpiry = Date.now() + 30 * 60 * 1000

    return verificationToken;
}



module.exports = mongoose.model("User", userSchema);