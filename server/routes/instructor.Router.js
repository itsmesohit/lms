const { createInstructor } = require("../controllers/instructor.Controller");
const { upload } = require("../middlewares/multer.Middleware");

const router = require("express").Router();



router.route('/create').post(upload.single("profilePicture"), createInstructor)

module.exports = router