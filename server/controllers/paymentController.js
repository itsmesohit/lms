const ApiResponse = require("../utills/apiResponse");
const asyncHandler = require("../utills/asyncHandler");
const Razorpay = require("razorpay")

// const sendRazorPayKey = asyncHandler(async (req, res) => {
//     return res.status(200).json(new ApiResponse(200, process.env.RAZERPAY_API_KEY, "Razorpay key sent"))
// })


// const captureRazorpayPayment = asyncHandler(async (req, res) => {
//     const instance = new Razorpay({
//         key_id: process.env.RAZERPAY_API_KEY,
//         key_secret: process.env.RAZERPAY_SECRET
//     })

//     const options = {
//         amount: req.body.amount,
//         currency: "INR",
//     }

//     const myOrder = await instance.orders.create(options);

//     return res.status(200).json(new ApiResponse(200, {
//         success: true,
//         amount: req.body.amount,
//         order: myOrder
//     }))

// })
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZERPAY_API_KEY,
    key_secret: process.env.RAZERPAY_SECRET
})

const renderProductPage = async (req, res) => {

    try {

        res.render('product');

    } catch (error) {
        console.log(error.message);
    }

}

const createOrder = async (req, res) => {
    try {
        const amount = req.body.amount
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        }

        razorpayInstance.orders.create(options,
            (err, order) => {
                if (!err) {
                    res.status(200).send({
                        success: true,
                        msg: 'Order Created',
                        order_id: order.id,
                        amount: amount,
                        key_id: RAZORPAY_ID_KEY,
                        product_name: req.body.name,
                        description: req.body.description,
                        contact: "8567345632",
                        name: "Sandeep Sharma",
                        email: "sandeep@gmail.com"
                    });
                }
                else {
                    res.status(400).send({ success: false, msg: 'Something went wrong!' });
                }
            }
        );

    } catch (error) {
        console.log(error.message);
    }

}


module.exports = { renderProductPage, createOrder }