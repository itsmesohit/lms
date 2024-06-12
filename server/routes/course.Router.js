const { createCourse, getAllCourse, getSingleCourse, adminUpdateSingleCourse, adminGetSingleProduct, adminGetSingleCourse, adminDeleteSingleCourse, addreviews, deleteReview, getOnlyReviewsForOneCourse } = require("../controllers/course.Controller");
const { verifyJWT, isAdmin } = require("../middlewares/auth.Middleware");

const router = require("express").Router();


//user routes
router.route('/all-courses').get(verifyJWT, getAllCourse)
router.route('/one-course/:id').get(verifyJWT, getSingleCourse);
router.route('/review/:id').put(verifyJWT, addreviews)
router.route('/review/:id').delete(verifyJWT, deleteReview)
router.route("/allreviews/:id").get(verifyJWT, getOnlyReviewsForOneCourse)



//admin routes
router.route('/create').post(verifyJWT, isAdmin, createCourse)
router.route('/single-course/:id').get(verifyJWT, isAdmin, adminGetSingleCourse)
router.route('/update/:id').patch(verifyJWT, isAdmin, adminUpdateSingleCourse)
router.route('/delete/:id').delete(verifyJWT, isAdmin, adminDeleteSingleCourse);



module.exports = router