/* USERS CRUD ROUTES */

// Imports
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Tattoo = require("../models/tattoo");
var middleware = require("../middleware");

// Getting all users view
router.get("/", function(req, res) {
    User.find({}, function(err, allUsers) {
      if(err) {
          req.flash("error", "Users not found!");
          res.redirect("/tattoos");
      } else {
          res.render("users/index", {users: allUsers});
      }
    });
});

// Getting information about chosen user
router.get("/:id", function(req, res) {
    User.findById(req.params.id).exec(function(err, foundUser) {
        if(err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/users");
        } else {
            Tattoo.find({'author.id': foundUser._id}, function(err, foundTattoos) {
                if(err) {
                    req.flash("error", "Something went wrong!");
                    res.redirect("/users");
                } else {
                    res.render("users/show", {user: foundUser, tattoos: foundTattoos});
                }
            })
        }
    });
});

// Getting 'Edit User' view
router.get("/:id/edit", middleware.checkUserOwnership, function(req, res) {
        User.findById(req.params.id, function(err, foundUser) {
            if(err) {
                req.flash("error", "Something went wrong!");
                res.redirect("/users");
            }
            res.render("users/edit", {user: foundUser}); 
    });
});

// Updating the user
router.put("/:id", middleware.checkUserOwnership, function(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser) {
        if(err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/users/"+ req.params.id);
        } else {
            res.redirect("/users/" + req.params.id);
        }
    });
});

module.exports = router;