var express = require('express');
const app = express.Router();


app.get('/logout', function (req, res) {
    req.session.destroy(function () {
       console.log("user logged out.")
    });
    res.render('sign_in', { message: 'logged out' })
 });
 

 module.exports = app;