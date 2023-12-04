var express = require('express');

const app = express.Router();
var Database = require('../models/database');
var Article = require('../models/articles');

app.get('/', function (req, res) {
  var message = req.query.msg;
    Database.find(function (err, response) {
       Article.find(function (err, article) {
          res.render('dashboard', { data: response,article,message });
    });
   });
});
     
module.exports = app;