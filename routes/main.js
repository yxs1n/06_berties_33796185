// Create a new router
const express = require("express")
const router = express.Router()
const {check, validationResult} = require('express-validator');
const request = require('request');

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

router.get('/weather', function(req, res, next){
    let apikey = process.env.WEATHER_API_KEY;
    let city = 'London';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
    request(url, function (err, response, body) {
        if(err){
            console.log('error:', error);
        } else {
            //res.send(body);
            //var weather = JSON.parse(body);
            //var wmsg = 'It is ' + weather.main.temp + ' degrees in ' + weather.name + '!<br>The humidity is: ' + weather.main.humidity;
            //res.send(wmsg);
            res.render('weather.ejs', {weather: JSON.parse(body), city: city});
        }
    });
});

router.post('/weather', [check('city').notEmpty()], function(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.send('There were validation errors: ' + JSON.stringify(errors.array()) + '<br><a href="/weather">Go back to weather</a>');
    } else {
        let apikey = process.env.WEATHER_API_KEY;
        let city = req.sanitize(req.body.city);
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
        request(url, function (err, response, body) {
            if(err){
                console.log('error:', error);
                res.send('Error occurred: ' + err + '<br><a href="/weather">Go back to weather</a>');
            } else {
                let weather = JSON.parse(body);
                if (weather!==undefined && weather.main!==undefined) {
                    // valid city
                    res.render('weather.ejs', {weather: JSON.parse(body), city: city});
                } else {
                    // invalid city
                    res.send('City not found. Please try again.<br><a href="/weather">Go back to weather</a>');
                    return;
                }
            }
        });
    }
});

// Export the router object so index.js can access it
module.exports = router