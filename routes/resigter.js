var express = require('express');
var bcrypt = require('bcrypt');
const app = express.Router();


var Database = require('../models/database');
var Article = require('../models/articles');
var Category = require('../models/category');

app.get('/register', function (req, res) {
    res.render('register', { message: '' })
 });
 
 app.post('/register', function (req, res) {
    var details = req.body;
   
    Database.findOne({ email: req.body.email }, async (err, response) => {
       console.log(response);
       if (response) {
          res.render('register', { message: 'User Already Exists! Login or choose another user id' });
       }
 
       else if (!details.name || !details.email || !details.password || !details.cpassword) {
          res.render('register', { message: "enter details" });
       }
       else if (details.password != details.cpassword) {
          res.render('register', { message: "paswword doesnot match", type: "error" });
       }
       else {

         const hash = await bcrypt.hash(details.password,10);
          var newPerson = new Database({
             name: details.name,
             email: details.email,
             password: hash,
             status: 1,
             privilege: 'premium',
             id: '',
             rating : 150,
             rejectedBy : '',
          });
 
          newPerson.save(function (err, person) {
             if (err)
                res.redirect('/register');
             else
             req.session.user = newPerson;
             res.redirect('/dashboard');
          });
 
       }
 
    });
 });
 



module.exports = app;