const { createInstructor } = require("../controllers/instructor.Controller");
const { isAdmin, verifyJWT } = require("../middlewares/auth.Middleware");
const { upload } = require("../middlewares/multer.Middleware");

const router = require("express").Router();


//only can add instructor
router.route('/create').post(verifyJWT, isAdmin, upload.single("profilePicture"), createInstructor)

module.exports = router