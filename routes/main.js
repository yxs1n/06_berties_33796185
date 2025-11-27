// Create a new router
const express = require("express")
const router = express.Router()
const {check, validationResult} = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login'); // redirect to login page
    } else {
        next(); // move to the next middleware function
    }
}

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

router.get('/logout', redirectLogin, function (req, res, next) {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('./');
        }
        res.send('You are now logged out. <a href="/">Go to home page</a>');
    });
});

// Export the router object so index.js can access it
module.exports = router