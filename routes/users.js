// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10;

// For default login
const defaultPassword = 'smiths';
bcrypt.hash(defaultPassword, 10, (err, hash) => {
    if (err) throw err;
    console.log(hash);
});

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login'); // redirect to login page
    } else {
        next(); // move to the next middleware function
    }
}



router.get('/register', function (req, res, next) {
    res.render('register.ejs')
});

router.post('/registered', function (req, res, next) {
    // saving data in database
    const plainPassword = req.body.password;
    bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        let sqlquery = 'INSERT INTO users (firstName, lastName, email, username, hashedPassword) VALUES (?, ?, ?, ?, ?)';
        // execute sql query
        let newrecord = [req.body.first, req.body.last, req.body.email, req.body.username, hash];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                res.send('Error registering user: ' + err);
                next(err);
            } else {
                console.log('User registered: ' + req.body.username);
                 // Confirmation message
                result = 'Hello ' + req.body.first + ' ' + req.body.last + ', you are now registered! We will send an email to you at ' + req.body.email
                result += ' Your password is: ' + plainPassword + ' and your hashed password is: ' + hash
                res.send(result);
            }
        });        
    });
}); 

// List all registered users
router.get('/list', redirectLogin, function (req, res, next) {
    let sqlquery = 'SELECT * FROM users';
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render('userlist.ejs', {registeredUsers: result});
    });
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs')
});

router.post('/loggedin', function (req, res, next) {
    const username = req.body.username;

    let sqlquery = 'SELECT * FROM users WHERE username = ?';
    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            next(err);
        }

        // Function to insert into audit_log
        function logAttempt(username, success) {
            const logSql = 'INSERT INTO audit_log (username, success) VALUES (?, ?)';
            db.query(logSql, [username, success], (err) => {
                if (err) console.error('Error logging login attempt:', err);
            });
        }

        if (result.length === 0) {
            // Log failed attempt
            logAttempt(username, false);
            res.send('No such user found');
        } else {
            const hashedPassword = result[0].hashedPassword;
            bcrypt.compare(req.body.password, hashedPassword, function(err, passwordMatch) {
                if (err) {
                    next(err);
                }

                if (passwordMatch) {
                    // Log successful attempt
                    logAttempt(username, true);
                    req.session.userId = req.body.username; // set session userId
                    res.send('Login successful! Welcome back, ' + result[0].firstName);
                } else {
                    // Log failed attempt
                    logAttempt(username, false);
                    res.send('Incorrect password');
                }
            });
        }
    });
});

//audit log route
router.get('/audit', redirectLogin, function (req, res, next) {
    let sqlquery = 'SELECT * FROM audit_log ORDER BY attempt_time DESC';

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render('auditlog.ejs', {auditLog: result});
    });
});

// Export the router object so index.js can access it
module.exports = router