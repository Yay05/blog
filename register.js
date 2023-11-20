var express = require('./.gitignore/node_modules/express');
const app = express.Router();

// var Person = require('./models/database');

app.get('/', function (req, res) {
    res.render('sign_in');
 });

 app.post('/', function (req, res) {
    res.redirect('/dashboard')
 });

app.get('/register', function (req, res) {
    res.render('register')
 });

 app.post('/register', function (req, res) {
    res.redirect('/dashboard')
 });

 app.get('/dashboard', function (req, res) {
    res.render('blog');
 });



module.exports = app;