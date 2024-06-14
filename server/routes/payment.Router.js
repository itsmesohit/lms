//const { sendRazorPayKey, captureRazorpayPayment } = require("../controllers/paymentController")
const { renderProductPage, createOrder } = require("../controllers/paymentController")
const { verifyJWT } = require("../middlewares/auth.Middleware")
const router = require("express").Router()

const bodyParser = require('body-parser');
const path = require('path');
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));

// router.route('/razorpaykey').get(verifyJWT, sendRazorPayKey)
// router.route('/capturerazorpay').post(verifyJWT, captureRazorpayPayment)

router.get('/', renderProductPage);
router.post('/createOrder', createOrder)
module.exports = router