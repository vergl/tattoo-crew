/* TATTOO CRUD ROUTES */

// Imports
var express = require("express");
var router = express.Router();
var Tattoo = require("../models/tattoo");
var middleware = require("../middleware");

// Getting all tattoos
router.get("/", function(req, res) {
    Tattoo.find({}, function(err, allTattoos) {
       if(err) {
           req.flash("error", "Tattoos not found!");
           res.redirect("/");
       } else {
           res.render("tattoos/index", {tattoos: allTattoos});
       }
    });

});

// Getting 'Create New Tattoo' view
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("tattoos/new");
});

// Posting a new tattoo
router.post("/", middleware.isLoggedIn, middleware.checkTattooFields, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var place = req.body.place;
    var size = req.body.size;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newTattoo = {name: name, price: price, image: image, description: description, place: place, size: size, author: author};
    Tattoo.create(newTattoo, function(err, newlyCreated) {
        if(err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/tattoos");
        } else {
            res.redirect("/tattoos"); 
        }
    });
});

// Getting a tattoo page
router.get("/:id", function(req, res) {
    Tattoo.findById(req.params.id).populate("comments").populate('author.id').exec(function(err, foundTattoo) {
        if(err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/tattoos");
        } else {
            res.render("tattoos/show", {tattoo: foundTattoo});
        }
    });
});

// Getting 'Edit Tattoo' view
router.get("/:id/edit", middleware.checkTattooOwnership, function(req, res) {
        Tattoo.findById(req.params.id, function(err, foundTattoo) {
            if(err) {
                req.flash("error", "Something went wrong!");
                res.redirect("/tattoos");
            } else {
                res.render("tattoos/edit", {tattoo: foundTattoo});     
            }
    });
});

// Updating the tattoo
router.put("/:id", middleware.checkTattooOwnership, function(req, res) {
    Tattoo.findByIdAndUpdate(req.params.id, req.body.tattoo, function(err, updatedTattoo) {
        if(err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/tattoos");
        } else {
            res.redirect("/tattoos/" + req.params.id);
        }
    });
});

// Deleting the tattoo
router.delete("/:id", middleware.checkTattooOwnership, function(req, res) {
    Tattoo.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/tattoos");
        } else {
            res.redirect("/tattoos");
        }
    });
});

module.exports = router;