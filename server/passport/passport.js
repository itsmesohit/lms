const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/user.Models")
const mongoose = require("mongoose");

require('dotenv').config(); // Load environment variables from .env file



passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    })
});
// console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback"
},
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ googelId: profile.id }).then((currentUser) => {
            if (currentUser) {
                console.log('user is', currentUser)
                done(null, currentUser)
            }
            else {
                new User({
                    fullName: profile.displayName,
                    googleId: profile.id,
                    avatar: profile.photos[0].value
                }).save().then((newUser) => {
                    console.log('new user created' + new User);
                    done(null, newUser)
                })
            }
        })
    }



))