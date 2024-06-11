const { createCourse, getAllCourse } = require("../controllers/course.Controller");
const { verifyJWT, isAdmin } = require("../middlewares/auth.Middleware");

const router = require("express").Router();


//user routes
router.route('/all-courses').get(getAllCourse)


//admin routes
router.route('/create').post(verifyJWT, isAdmin, createCourse)

module.exports = router