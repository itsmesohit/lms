const express = require("express");
const router = express.Router();
const { upload } = require('../middlewares/multer.Middleware');
const { registerUser } = require("../controllers/user.Controller")

router.route("/register").post(upload.single('avatar'), registerUser);



module.exports = router