// Create a new router
const e = require("express");
const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    //searching in the database
    res.send("You searched for: " + req.query.keyword)
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

// Export the router object so index.js can access it
module.exports = router
