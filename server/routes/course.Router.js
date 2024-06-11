const { createCourse, getAllCourse, getSingleCourse, adminUpdateSingleCourse, adminGetSingleProduct, adminGetSingleCourse, adminDeleteSingleCourse } = require("../controllers/course.Controller");
const { verifyJWT, isAdmin } = require("../middlewares/auth.Middleware");

const router = require("express").Router();


//user routes
router.route('/all-courses').get(getAllCourse)
router.route('/one-course/:id').get(getSingleCourse);

//admin routes
router.route('/create').post(verifyJWT, isAdmin, createCourse)
router.route('/single-course/:id').get(verifyJWT, isAdmin, adminGetSingleCourse)
router.route('/update/:id').patch(verifyJWT, isAdmin, adminUpdateSingleCourse)
router.route('/delete/:id').delete(verifyJWT, isAdmin, adminDeleteSingleCourse);



module.exports = router