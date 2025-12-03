// routes/api.js
const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

router.get('/books', function (req, res, next) {
    const {search} = req.query;
    const {minprice} = req.query;
    const {max_price} = req.query;
    const {sort} = req.query;

    if (search) {
        // If a search query is provided, filter the books
        let sqlquery = 'SELECT * FROM books WHERE name LIKE ?';
        let searchterm = ['%' + req.sanitize(search) + '%'];
        db.query(sqlquery, searchterm, (err, result) => {
            if (err) {
                res.json(err);
                next(err);
            } else {
                res.json(result);
            }
        });
        return;
    }

    if (minprice && max_price) {
        // If minprice and maxprice are provided, filter the books within the price range
        let sqlquery = 'SELECT * FROM books WHERE price BETWEEN ? AND ?';
        let priceterm = [parseFloat(req.sanitize(minprice)), parseFloat(req.sanitize(max_price))];
        db.query(sqlquery, priceterm, (err, result) => {
            if (err) {
                res.json(err);
                next(err);
            } else {
                res.json(result);
            }
        });
        return;
    }

    if (sort=='name' || sort=='price') {
        // If sort parameter is provided, sort the books accordingly
        let sqlquery = `SELECT * FROM books ORDER BY ${sort} ASC`;
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.json(err);
                next(err);
            } else {
                res.json(result);
            }
        });
        return;
    }

    // Query database to get all the books
    let sqlquery = 'SELECT * FROM books';

    // Execute the query
    db.query(sqlquery, (err, result) => {
        if (err) {
            res.json(err);
            next(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;