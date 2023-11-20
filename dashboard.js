var express = require('./.gitignore/node_modules/express');

const app = express.Router();


// var Person = require('./models/database');

const register = require('./register');
app.use('/dashboard', register);

app.get('/dashboard', function (req, res) {
    res.render('blog');
 });



module.exports = app;