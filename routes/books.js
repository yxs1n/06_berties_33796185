// Create a new router
const e = require("express");
const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.post('/search_result', function (req, res, next) {
    //searching in the database
    let sqlquery = 'SELECT * FROM books WHERE name = ?';
    let searchterm = [req.body.search_text];
    db.query(sqlquery, searchterm, (err, result) => {
        if (err) {
            next(err);
        }
        res.render('search_result.ejs', {availableBooks: result});
    });
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
router.get('/addbook', function (req, res, next) {
    // Display the add book form
    res.render('addbook.ejs');
});
// Handle the form submission
router.post('/bookadded', function (req, res, next) {
    //saving data in database
    let sqlquery = 'INSERT INTO books (name, price) VALUES (?, ?)';
    //execute sql query
    let newrecord = [req.body.name, req.body.price];
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        }else {
            // Confirmation message
            res.send('This book has been added: ' + req.body.name + ' for £' + req.body.price);
        }
    });
});

router.get('/bargainbooks', function (req, res, next) {
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
