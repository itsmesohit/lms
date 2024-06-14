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

const renderProductPage = async (req, res) => {

    try {

        res.render('product');

    } catch (error) {
        console.log(error.message);
    }

}



const createOrder = async (req, res) => {
    try {
        const { amount, name, description } = req.body;

        if (!amount || !name || !description) {
            return res.status(400).send({ success: false, msg: 'All fields are required!' });
        }

        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_ID_KEY,
            key_secret: process.env.RAZORPAY_SECRET_KEY
        });

        const options = {
            amount: amount * 100, // Amount should be in the smallest currency unit
            currency: 'INR',
            receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(200).send({
            success: true,
            msg: 'Order Created',
            order_id: order.id,
            amount: amount,
            key_id: process.env.RAZORPAY_ID_KEY,
            product_name: name,
            description: description,
            contact: "8567345632", // Ideally, get this from the request
            name: "Sandeep Sharma", // Ideally, get this from the request
            email: "sandeep@gmail.com" // Ideally, get this from the request
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, msg: 'Internal Server Error' });
    }
}




module.exports = { renderProductPage, createOrder }