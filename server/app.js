const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser')




require('dotenv').config(); // Load environment variables from .env file



// Import routes
const Home = require('./routes/Home');
const userRoutes = require('./routes/user.Router')
const instructorRoutes = require("./routes/instructor.Router")


// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.json())
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(cookieParser())
// MongoDB connection





// Define routes
app.use('/', Home);
app.use('/api/user', userRoutes);
app.use('/api/instructor', instructorRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app;
