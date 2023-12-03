
var express = require('express');
const app = express.Router();
// const dashboard = require('./dashboard');

var Database = require('../models/database');
var Article = require('../models/articles');
var Category = require('../models/category');




app.get('/', function (req, res) {
    res.render('sign_in', { message: '' });
 });
 
 app.post('/', function (req, res) {
    var flag = 0;
    
    Database.find(function (err, data) {
    Article.find(function (err, response) {
      data.forEach(datas => {
         if(datas.privilege === 'basic' || datas.privilege ==='premium'){

         let Totalrating = 0;
            response.forEach(responses => {
         if(datas._id == responses.id )
         {
            Totalrating += responses.totalLikes
           
         }
       });
       if(Totalrating >= 50){
        
       Database.findByIdAndUpdate(datas._id, { rating: Totalrating, privilege : 'premium' }, function (err, response) {
       if(err){
         console.log('error updating  rating ')
       }
       else{
         console.log('sccess updating rating')
       }
      });
      }
   }
      });
      
    });
   });
    
   if (!req.body.email || !req.body.password) {
       flag = 0;
       res.render('sign_in', { message: "Please enter both id and password" });
    }
    else {
       Database.findOne({ email: req.body.email }, (err, response) => {
 
          if(!response){
             res.render('sign_in', { message: "user does not exixt" });
          }
 
         else if (response.email === req.body.email && response.password === req.body.password && response.privilege === 'basic' || response.privilege === 'premium' && response.status === 1) {
             req.session.user = response;
             flag = 1;
             res.redirect('/dashboard');
          }
          else if (response.email === req.body.email && response.password === req.body.password && response.privilege === 'admin') {
             req.session.user = response;
             flag = 1;
             res.redirect('/admin');
          }
 
          else if (response.email === req.body.email && response.password === req.body.password && response.privilege === 'topicManager') {
             req.session.user = response;
             flag = 1;
             res.redirect('/topicManager');
          }
          else {
             res.render('sign_in', { message: "invalid details" });
             console.log('error')
             return;
          }
       });
    }

    
 });
 


 module.exports = app;