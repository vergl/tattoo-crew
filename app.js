/* INITIALIZING VARIABLES */

// Libraries:
var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    flash            = require("connect-flash"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    methodOverride   = require("method-override");

// Models:    
var User             = require("./models/user");

// Routes:
var commentRoutes    = require("./routes/comments"),
    userRoutes       = require("./routes/users"),
    tattooRoutes     = require("./routes/tattoos"),
    indexRoutes      = require("./routes/index");

/* MONGODB CONNECTION SETUP */
mongoose.connect("mongodb://user:password@ds145009.mlab.com:45009/tattoos");

/* BASIC EXPRESS SETUP */

// Body Parser:
app.use(bodyParser.urlencoded({extended: true}));

// View Engine:
app.set("view engine", "ejs");

// Static data directory:
app.use(express.static(__dirname + "/public"));

// Method Override:
app.use(methodOverride("_method"));

// Passport:
app.use(require("express-session")({
    secret: "New secret sentence",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Connect-flash:
app.use(flash());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Routes:
app.use("/",indexRoutes);
app.use("/tattoos/:id/comments", commentRoutes);
app.use("/tattoos", tattooRoutes);
app.use("/users", userRoutes);

/* APPLICATION STARTING */
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Application is running!");
});