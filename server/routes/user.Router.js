const express = require("express");
const router = express.Router();
const { upload } = require('../middlewares/multer.Middleware');
const { registerUser, loginUser, logoutUser, refreshedAccessToken,
    changeCurrentPassword, updateAccountDetails, updateUserAvatar,
    forgetPassword,
    resetPassword,
    accountVerify,
} = require("../controllers/user.Controller");
const { verifyJWT } = require("../middlewares/auth.Middleware")

router.route("/register").post(upload.single('avatar'), registerUser);
router.route("/login").post(loginUser);
router.route("/forget-password").post(forgetPassword)
router.route("/password/reset/:token").post(resetPassword);
router.route("/account-verification/:token").post(accountVerify)

//secure_routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-access-token").post(refreshedAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-details").post(verifyJWT, updateAccountDetails);
router.route("/update-avatar").post(verifyJWT, upload.single('avatar'), updateUserAvatar);



module.exports = router