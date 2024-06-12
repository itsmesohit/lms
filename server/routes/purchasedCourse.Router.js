const { createPurchasedCourse, getOnePurchasedCourse, getLoggedInUserCourse, adminGetAllCoursesPurchased } = require("../controllers/purchasedCourse.Controller")
const { verifyJWT, isAdmin } = require("../middlewares/auth.Middleware")

const router = require("express").Router()

router.route('/create').post(verifyJWT, createPurchasedCourse)
router.route('/:id').get(verifyJWT, getOnePurchasedCourse);
router.route('/get/mycourses').get(verifyJWT, getLoggedInUserCourse);

//admin route

router.route('/admin/courses').get(verifyJWT, isAdmin, adminGetAllCoursesPurchased)







module.exports = router