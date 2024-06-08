const express = require("express");
const router = express.Router();
const { upload } = require('../middlewares/multer.Middleware');
const { registerUser, loginUser, logoutUser, refreshedAccessToken } = require("../controllers/user.Controller");
const verifyJWT = require("../middlewares/auth.Middleware")

router.route("/register").post(upload.single('avatar'), registerUser);
router.route("/login").post(loginUser);


//secure_routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-access-token").post(refreshedAccessToken)


module.exports = router