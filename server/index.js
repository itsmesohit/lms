const app = require('./app');
const connectDB = require('./config/db');
const express = require("express");
const passport = require("passport")
const session = require("express-session")


app.use(express.json())
require('dotenv').config(); // Load environment variables from .env file
require('./passport/passport')

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}))


app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs')


const PORT = process.env.PORT || 4000; // Use port from environment variable or default to 3000

//mongoDB connection


connectDB()


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
