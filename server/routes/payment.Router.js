const { sendRazorPayKey, captureRazorpayPayment } = require("../controllers/paymentController")
const { verifyJWT } = require("../middlewares/auth.Middleware")

const router = require("express").Router()


router.route('/razorpaykey').get(verifyJWT, sendRazorPayKey)
router.route('/capturerazorpay').post(verifyJWT, captureRazorpayPayment)

module.exports = router