const app = require('./app');
const connectDB = require('./config/db');
const express = require("express");
app.use(express.json())

require('dotenv').config(); // Load environment variables from .env file

const PORT = process.env.PORT || 4000; // Use port from environment variable or default to 3000

//mongoDB connection


connectDB()


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
