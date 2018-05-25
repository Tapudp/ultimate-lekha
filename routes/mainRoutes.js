const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index');
});

ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_message');
        res.redirect('/users/login');
    }
}

module.exports = router;
