
var express = require('express');
const app = express.Router();
var bcrypt = require('bcrypt');
// const dashboard = require('./dashboard');

var Database = require('../models/database');
var Article = require('../models/articles');
var Category = require('../models/category');




app.get('/sign_in', async function (req, res) {
    res.render('sign_in', { message: '' });
 });
 
 app.post('/sign_in', function (req, res) {
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
       Database.findOne({ email: req.body.email },  async (err, response) => {
 
          if(!response){
             res.render('sign_in', { message: "user does not exixt" });
          }

          else if(response.rejectedBy === 'topicManager'){
            res.render('sign_in', { message: " blocked by Topic Manager" });
          }

          else if(response.rejectedBy ==='admin'){
            res.render('sign_in', { message: " blocked by Admin " });
          }

 
         else if (response.email) {
            const isValid = await bcrypt.compare(req.body.password,response.password);
           if(response.email === req.body.email && response.privilege === 'basic' || response.privilege === 'premium' && response.status === 1 && isValid){
            req.session.user = response;
             flag = 1;
             res.redirect('/dashboard');
            }

            else if (response.email === req.body.email && response.privilege === 'admin' && response.password === req.body.password) {
               req.session.user = response;
               flag = 1;
               res.redirect('/admin');
            }

            else if (response.email === req.body.email && response.privilege === 'topicManager' && isValid) {
               req.session.user = response;
               flag = 1;
               res.redirect('/topicManager');
            }

            else{
               res.render('sign_in', { message: "  invalid email or password " });
            }
          }
         
 
          
          else {
             res.render('sign_in', { message: "invalid credentials" });
             console.log('error')
             return;
          }
       });
    }

    
 });
 


 module.exports = app;