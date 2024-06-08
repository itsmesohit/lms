const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`Mongo DB connection established !! DB HOSt : ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log("MONGO DB connection failed !!")
        process.exit(1);
    }
}

module.exports = connectDB;

