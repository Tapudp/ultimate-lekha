const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err,user) => {
        done(err, user);
    });
});


passport.use(new LocalStrategy(
    (username, password, done) => {
        User.getUserByUsername(username, (err, user) => {
            if(err) throw err;
            if(!user) { 
                return done(null, false, {message: 'Unknown error'});
            }
            User.comparePassword(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }
));

passport.use( new GoogleStrategy({
    // options for the google strategy
    callbackURL: '*',
    clientID: '*',
    clientSecret: '*'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exist in db
        console.log(profile);
        User.findOne({googleId: profile.id}).then(currentUser => {
            if(currentUser){
                // already have the user
                done(null, currentUser);
                console.log('user is:', currentUser);
            } else {
                // if not user in our db
                new User({
                    username: profile.displayname,
                    googleId: profile.id,
                    thumbnail: profile._json.image.url
                }).save().then(newUser => {
                    console.log('new User created : '+newUser);
                    done(null, newUser);
                });
            }
        });
        console.log('passport callback function has fired');
        console.log(profile);
    }
))