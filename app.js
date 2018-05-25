const express = require('express');
const expressValidator = require('express-validator');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const morgan = require('morgan');
const multer = require('multer');
var upload = multer({ dest: 'uploads/' });
const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./config/keys');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');

// starting the app as an express app
const app = express();
// getting connected to the databse
mongoose.connect(keys.mongodb.dbURI, () => {
    console.log(`|/~sponsorship has been sailed upon~/|`);
});

// middlewares
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({
    secret: 'ilovebutterscotch',
    saveUninitialized: true,
    resave: true
}))

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// middleware for the express validator
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        var namespace = param.split('.');
        var root = namespace.shift();
        var formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() +']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    } 
}));

// connect flash
app.use(flash());

//Global Variables
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

// routes to add upon
app.use('/', mainRoutes);
app.use('/users', userRoutes);


module.exports = app;