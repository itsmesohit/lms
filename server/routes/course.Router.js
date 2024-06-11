const { createCourse } = require("../controllers/course.Controller");
const { verifyJWT, isAdmin } = require("../middlewares/auth.Middleware");

const router = require("express").Router();


router.route('/create').post(verifyJWT, isAdmin, createCourse)

module.exports = router