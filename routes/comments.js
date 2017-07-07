/* COMMENTS CRUD ROUTER */

// Imports
var express = require("express");
var moment = require('moment');
var router = express.Router({mergeParams: true});
var Tattoo = require('../models/tattoo');
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Getting 'Create New Comment' view
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Tattoo.findById(req.params.id, function(err, tattoo) {
        if(err) {
            req.flash("error", "An error occured.");
            res.redirect("/tattoos");
        } else {
            res.render("comments/new", {tattoo: tattoo});
        }
    });
});

// Posting new comment
router.post("/", middleware.isLoggedIn, function(req, res) {
    Tattoo.findById(req.params.id, function(err, tattoo) {
        if(err) {
            req.flash("error", "An error occured.");
            res.redirect("/tattoo");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                     req.flash("error", "Something went wrong!");
                } else {
                    comment.date = Date.now();
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    tattoo.comments.push(comment);
                    tattoo.save();
                     req.flash("success", "Successfully added comment!");
                    res.redirect("/tattoos/" + tattoo._id);
                }
            });
        }
    });
});

// Getting 'Edit Comment' view
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    var tattoo_id = req.params.id;
    Comment.findById(req.params.comment_id, function(err, foundComment) {
       if(err) {
           req.flash("error", "An error occured.");
           res.redirect("back");
       } else {
           res.render("comments/edit", {tattoo_id: tattoo_id, comment: foundComment});
       }
    });
});

// Updating the comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            req.flash("error", "An error occured.");
            res.redirect("back");
        } else {
            res.redirect("/tattoos/" + req.params.id);
        }
    });
});

// Deleting the comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            req.flash("error", "An error occured.");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/tattoos/" + req.params.id);
        }
    });
});

module.exports = router;