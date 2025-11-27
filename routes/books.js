// Create a new router
const e = require("express");
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

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.post('/search_result', [check('search_text').notEmpty()], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.send('Search text cannot be empty. <br><a href="/books/search">Go back to search</a>');
        return;
    }else {
        //searching in the database
        let sqlquery = 'SELECT * FROM books WHERE name LIKE ?';
        //adding % wildcard to search term (advanced search)
        let searchterm = ['%' + req.body.search_text + '%'];
        db.query(sqlquery, searchterm, (err, result) => {
            if (err) {
                next(err);
            }
            res.render('search_result.ejs', {availableBooks: result});
        });
    }
});

router.get('/list', function (req, res, next) {
    let sqlquery = 'SELECT * FROM books';

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render('list.ejs', {availableBooks: result});
    });
});

// Add book routes
router.get('/addbook', redirectLogin, function (req, res, next) {
    // Display the add book form
    res.render('addbook.ejs');
});
// Handle the form submission
router.post('/bookadded', [check('name').notEmpty(), check('price').isFloat()], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.send('There were validation errors: ' + JSON.stringify(errors.array()) + '<br><a href="/books/addbook">Go back to add book</a>');
        return;
    }
    else {
        //saving data in database
        let sqlquery = 'INSERT INTO books (name, price) VALUES (?, ?)';
        //execute sql query
        let newrecord = [req.body.name, req.body.price];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err);
            }else {
                // Confirmation message
                res.send('This book has been added: ' + req.sanitize(req.body.name) + ' for £' + req.body.price);
            }
        });
    }
});

router.get('/bargainbooks', redirectLogin, function (req, res, next) {
    // Only show books priced under £20
    let sqlquery = 'SELECT * FROM books WHERE price < 20.00';
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render('bargainbooks.ejs', {availableBooks: result});
    });
});

// Export the router object so index.js can access it
module.exports = router
