/* MONGOOSE MODEL OF COMMENT OBJECT */

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    image: String,
    birthDate: String,
    country: String,
    city: String,
    about: String
});

//Setting up authentication plugin
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);