const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

// Use partials to divide code into reusable partial snippets
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// The use() method is used to set up middleware
// A middleware is a piece of code that runs before the requests are to be handled
// Middleware are handled in the sequence they are used
app.use((req, res, next) => {
    const now = new Date().toString();
    const log = `${now}: ${req.method} ${req.path}`;
    console.log(log);
    
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to save log');
        }
    });
    
    // Use next() to move to GET and POST methods
    // without next() the GET POST requests will not be served!
    next();    
});
// In case of maintainance, following trick can be used: 👇🏻👇🏻
// app.use((req, res, next) => {
//     res.render('maintainance.hbs');
// });

app.use(express.static(__dirname + '/public'));
    
// Use helpers to pass functions inside Handlebars
hbs.registerHelper('getFullYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => text.toUpperCase());

app.get('/', (req, res) => {
    //res.send('<h1>Hello express</h1>');
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website!'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to fulfill request'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});



