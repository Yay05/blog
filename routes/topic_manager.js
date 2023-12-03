var express = require('express');
const app = express.Router();
// const dashboard = require('./dashboard');

var Database = require('../models/database');
var Article = require('../models/articles');
var Category = require('../models/category');

// app.use('/dashboard', dashboard);

app.use(function (req, res, next) { res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); next(); });

function checkSignIn(req, res, next) {
   if(!req.session.user){
      res.redirect('/'); 
   }

   else if (req.session.user.privilege === 'topicManager') {
      next();     //If session exists, proceed to page
   } 
    else {

      res.redirect('/?msg= error not logged in');
      var err = new Error("Not logged in!");
      // console.log(req.session.user);
      next(err);  //Error, trying to access unauthorized page!
   }
}

//add a field called type in db and check if the type is admin or normal user 

app.get('/topicManager', checkSignIn, function (req, res) {
   var Message = req.query.msg;
   var id = req.session.user.id;
   Database.find(function (err, response) {
      Article.find(function (err, articles) {
      // console.log(articles)
      // console.log(response)
      if (Message) {
         res.render('topic_manager', { data: response, id, Message,articles });
         // console.log(Message);
      }
      else {
         res.render('topic_manager', { data: response,id, Message : '',articles});
      }
   });
});
});



app.get('/rejectUser/:id',checkSignIn, function (req, res) {
   Database.findByIdAndUpdate(req.params.id, { status: 0 }, function (err, response) {
      if (err) {
            res.redirect('topicManager?msg= error rejecting');
      }
      else {

         res.redirect('/topicManager')
      }
   });
});

app.get('/acceptUser/:id', checkSignIn,function (req, res) {
   Database.findByIdAndUpdate(req.params.id, { status: 1 }, function (err, response) {
      if (err) {
            res.redirect('topicManager?msg= error accepting');
      }
      else {

         res.redirect('/topicManager')
      }
   });
});



app.get('/accept_Article/:id', checkSignIn,function (req, res) {
   Article.findOneAndUpdate({count : req.params.id}, { isAccepted: 1 }, function (err, response) {
      console.log(response)
      console.log(req.params.id)
      if (err) {
            res.redirect('topicManager?msg= error accepting');
      }
      else {

         res.redirect('/topicManager?msg=  accepted')
      }
   });
 
   
   
});

app.get('/reject_Article/:id', checkSignIn,function (req, res) {
   Article.findOneAndUpdate({count : req.params.id}, { isRejected: 1 }, function (err, response) {
      console.log(response)
      console.log(req.params.id)
      if (err) {
            res.redirect('topicManager?msg= error accepting');
      }
      else {

         res.redirect('/topicManager?msg=  rejected')
      }
   });
   
   
});



module.exports = app;