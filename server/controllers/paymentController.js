const ApiResponse = require("../utills/apiResponse");
const asyncHandler = require("../utills/asyncHandler");


const sendRazorPayKey = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, process.env.RAZERPAY_API_KEY, "Razorpay key sent"))
})


const captureRazorpayPayment = asyncHandler(async (req, res) => {
    const instance = new Razorpay({
        key_id: process.env.RAZERPAY_API_KEY,
        key_secret: process.env.RAZERPAY_SECRET
    })

    const options = {
        amount: req.body.amount,
        currency: "INR",
    }

    const myOrder = await instance.orders.create(options);

    return res.status(200).json(new ApiResponse(200, {
        success: true,
        amount: req.body.amount,
        order: myOrder
    }))

})

module.exports = { sendRazorPayKey, captureRazorpayPayment }