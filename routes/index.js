/* MAIN APPLICATION ROUTES */

// Imports
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Index route sends to landing page
router.get("/", function(req, res) {
   res.render("landing"); 
});

// Register route
router.get("/register", function(req, res) {
    res.render("register");
});

// Creating new user
router.post("/register", function(req, res) {
    if(req.body.password !== req.body.confirmPassword) {
        req.flash("error", "Password not confirmed!");
        res.redirect("register");
    } else {
        var newUser = new User({
            username: req.body.username,
            image: req.body.image,
            exp: req.body.exp,
            country: req.body.country,
            city: req.body.city
        });
        User.register(newUser, req.body.password, function(err, user) {
            if(err) {
                req.flash("error", err.message);
                return res.redirect("/register");
            }
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome to Tattoo Crew, " + user.username + "! Please, fill some information about yourself.");
                res.redirect("/users/"+user._id+"/edit");
            });
        });
    }
});

// Login route
router.get("/login", function(req, res) {
    res.render("login");
});

// Logging in
router.post("/login", passport.authenticate("local", {
    successRedirect: "/tattoos",
    failureRedirect: "/login",
    failureFlash: true
}), function(req, res) {
});

// Logging out
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/tattoos");
});

module.exports = router;