
// Require express
const express = require('express');
const router = express.Router();


// import controller
const {Home} = require('../controllers/Home');



// Define routes
router.get("/",Home);



module.exports = router;