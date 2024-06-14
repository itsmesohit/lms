const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const Razorpay = require("razorpay");
const PassportSetup = require('./passport/passport')
const cookieSession = require('cookie-session')

require('dotenv').config(); // Load environment variables from .env file



// Import routes
const Home = require('./routes/Home');
const userRoutes = require('./routes/user.Router')
const instructorRoutes = require("./routes/instructor.Router")
const courseRoutes = require("./routes/course.Router")
const paymentRoutes = require("./routes/payment.Router")
const purchasedCourseRoutes = require("./routes/purchasedCourse.Router")
const authRoutes = require("./routes/auth.Router");
const passport = require('passport');
// Initialize Express app
const app = express();

app.set('view engine', 'ejs');


// Middleware
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.SESSION_SECRET]
}))

//initialize passport 
app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(cookieParser())
// MongoDB connection




// Define routes
app.use('/', Home);
app.use('/', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/instructor', instructorRoutes)
app.use('/api/course', courseRoutes)
app.use('/payment', paymentRoutes)
app.use('/api/purchasedcourse', purchasedCourseRoutes)


//razorpay testing !!







app.get("/home", (req, res) => {
  res.render("home")
})



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app;
