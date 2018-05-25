const express = require('express');
const router = express.Router();
// for the multer setup
const multer = require('multer');
var upload = multer({ dest: './public/uploads' });
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');

// Register
router.get('/register', (req, res, next) => {
    res.render('register');
});

//Login
router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/register', (req, res, next) => {
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var profileimage = upload.single('avatar');

    // check image field
    if(profileimage){
        console.log('uploading file...');
        // file info
        var profileimage_originalname = profileimage.originalname;
        var profileimage_name = profileimage.name;
        var profileimage_mime = profileimage.mimetype;
        var profileimage_path = profileimage.path;
        var profileimage_ext = profileimage.extension;
        var profileimage_size = profileimage.size;
    } else {
        // set a default image
        var profileimage_default = 'noimage.png';
    }

    var errors = req.validationErrors();

    // validation
    req.checkBody('username', 'Name is Required...').notEmpty();
    req.checkBody('email', 'Email is necessary bruh...').notEmpty();
    req.checkBody('email', 'Email has its own format too').isEmail();
    req.checkBody('password', 'password is must...').notEmpty();
    req.checkBody('password2', 'confirm it...').notEmpty();

    if(errors) {
        res.render('register', {
            errors: errors,
            username: username,
            email: email,
            password: password,
            password2: password2
        });
    } else {
        var newUser = new User({
            username: username,
            email: email,
            password: password,
            profileimage: profileimage_name
        });

        //create User
        User.createUser(newUser, (err, user) => {
            if(err) throw err;
            console.log(user);
        })
        // User.find({ email: req.body.email })
        //     .exec()
        //     .then(user => {
        //         if(user.length >= 1){
        //             res.status(409).json({
        //                 message: 'Email exists, try adding some other email address'
        //             });
        //         } else {
        //             User.createUser(newUser, result => {
        //                 console.log(result);
        //                 res.status(201).json({
        //                     message: 'User created'
        //                 });
        //             })
        //         }
        //     }).catch(err => {
        //         console.log(err);
        //         res.status(500).json({
        //             error: err
        //         });
        //     });
            
            // success message
            req.flash('success_message', 'You are now registered and may login');

            res.redirect('/users/login');
        }
    console.log(username);
})

router.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}), (req, res) => {
    res.redirect('/');
});

router.post('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/users/login');
    res.flash('success_message', 'You are now logged out');
});

router.get('/blog', (req, res) => {
    var users = User.find({}, (err, posts) => {
        res.render('user', {
            'user': users
        } );
    });
});

router.post('/blog', (req, res, next) => {
    var title = req.body.title;
    var category = req.body.category;
    var postBody = req.body.postBody;
    var author = req.body.author;

    var errors = req.validationErrors();

    if(errors) {
        res.render('blog', {
            errors: errors,
            title: title,
            category: category,
            postBody: postBody,
            author: author
        });
    } else {
        var newPost = new Post({
            title: title,
            category: category,
            postBody: postBody,
            author: author
        });
    }

    // creating new post
    newPost.save().then(post => {
        console.log(post);
        res.status(201).json({
            messsage: 'created the post Successfully',
            createdPost: {
                title: post.title,
                category: post.category,
                postBody: post.postBody,
                author: post.author
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.get('/blogposts', (req, res, next) => {
    var post = Post.find({}, (err, posts) => {
        res.render('blogposts', {
            'post': post
        });
    });
});





module.exports = router;