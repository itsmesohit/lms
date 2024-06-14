const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // Generate JWT token after successful login
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token);

        // Redirect to dashboard
        res.redirect('/');
    }
);

router.get('/auth/success', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Google Authentication Successful',
        token: req.cookies.token
    });
});

router.get('/logout', (req, res) => {
    res.cookie('token', '', { maxAge: 1 }); // Clear the token cookie
    res.redirect('/api/v1');
});

module.exports = router;
