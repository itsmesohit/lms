const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/user.Models")
const mongoose = require("mongoose");


passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    done(null, user);
})

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, //change id
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // change secret
    callbackURL: "http://localhost:4000/auth/google/callback",
    passReqToCallback: true
},
    function (req, accessToken, refreshToken, profile, done) {
        return done(null, profile)
    }

));