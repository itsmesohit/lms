const router = require('express').Router()
const passport = require('passport');
//auth login
router.get('/login', (req, res) => {
    res.render("login")
})


//auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));


//auth logout
router.get('/logout', (req, res) => {
    //handle with passport
    res.send("log out with google")
})

//callback route
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.send('you reached at your dash board !!', req.user)
})



module.exports = router