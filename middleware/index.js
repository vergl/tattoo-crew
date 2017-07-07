/* MIDDLEWARES ARE USED TO VALIDATE DATA 
** AND PERMISSIONS IN CRUD OPERATIONS.
** MOVED TO ANOTHER FILE FOR READABILITY
** AND CONSISTENCY. */

// Initialising models:
var Tattoo = require("../models/tattoo");
var Comment = require("../models/comment");
var User = require("../models/user");

// Initialising middleware object:
var middlewareObj = {};

/* MIDDLEWARE FUNCTIONS */

// Function checks comment ownership and denies access to
// not authenticated users and users that are not owners
// of current comment.
middlewareObj.checkCommentOwnership = function (req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            req.flash("error", "Comment not found!");
            res.redirect("back");
        } else {
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

// Function checks tattoo ownership and denies access to
// not authenticated users and users that are not owners
// of current tattoo.
middlewareObj.checkTattooOwnership = function (req, res, next) {
    if(req.isAuthenticated()) {
        Tattoo.findById(req.params.id, function(err, foundTattoo) {
        if(err) {
            req.flash("error", "Tattoo not found!");
            res.redirect("back");
        } else {
            if(foundTattoo.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

// Function denies access to not authenticated users
// and users that tries to get information about another user
// to edit data about this user.
middlewareObj.checkUserOwnership = function (req, res, next) {
    if(req.isAuthenticated()) {
        User.findById(req.params.id, function(err, foundUser) {
        if(err) {
            req.flash("error", "User not found!");
            res.redirect("back");
        } else {
            if(foundUser._id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};


// Function checks whether this user logged in or not.
middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

// Function validates data about tattoo.
middlewareObj.checkTattooFields = function (req, res, next) {
    if (!req.body.price || !req.body.name || !req.body.image ||
        !req.body.size || !req.body.place || !req.body.description) {
            req.flash("error", "All fields should not be empty!");
            res.redirect("tattoos/new");
        } else {
            next();
        }
};

module.exports = middlewareObj;