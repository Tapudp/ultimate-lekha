const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
var userSchema = mongoose.Schema({
    username: {type: String, index: true},
    password: {type: String},
    email: {type: String},
    profileimage: {type: String} 
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = (newUser, callback) => {
    // from the BCryptjs npmp page
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            // Store hashed password in your DB.
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = (username, callback) => {
    var query = { username: username };
    User.findOne(query.callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}