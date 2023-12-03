var express = require('express');

const app = express.Router();
var Database = require('../models/database');
var Article = require('../models/articles');
var Category = require('../models/category');

// var Person = require('./models/database');

app.use(function (req, res, next) { res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); next(); });

function checkSignIn(req, res, next) {
    if(!req.session.user){
      res.redirect('/'); 
   }

   else if (req.session.user.privilege === 'basic' || req.session.user.privilege === 'premium') {
      next();     //If session exists, proceed to page
   } 
    else {
      res.redirect('/?msg= error not logged in');
      
      var err = new Error("Not logged in!");
      console.log(req.session.user);
      next(err);  //Error, trying to access unauthorized page!
   }
}

app.get('/dashboard', checkSignIn, function (req, res) {
  var Message = req.query.msg;
  Article.find(function (err, response) {
     Category.find(function (err, data) {
      
        if (Message) {
           res.render('blog', {  id: req.session.user._id, user_name:req.session.user.name ,message: Message, newarticle: response, Data: data });
          
        }
        else {
           res.render('blog', {  id: req.session.user._id,  user_name:req.session.user.name,message: '', newarticle: response, Data: data });
           
        }
     });
  });
});

app.post('/add_articles/:id',checkSignIn, function (req, res) {
   var data = req.body;
   var u_id = req.params.id;
   Article.findOne({ article: data.article }, (err, response) => {
      if (response  && response.isAccepted === 1 ) {
         res.redirect('/dashboard?msg=article already exist');
         // res.render('blog', {  message: 'article already exist',id: u_id,newarticle :'' });
      }
      else if (!data.article ) {       
         res.redirect('/dashboard?msg=article is empty');
         // res.render('blog',{message: 'article is empty',id: u_id,newarticle :''})
      }

      else {
         Article.count({},function(err,countRes){
            if(err){
               console.log('error');
            }
            else{
               console.log(countRes);
            }
         
         const newArticle = new Article({

            id: u_id,
            name : req.session.user.name,
            article: data.article,
            category: data.category,
            topic: data.topic,
            isAccepted: 0,
            isRejected: 0,
            count : countRes + 1,
            totalLikes : 0,

         }); 

         // Save the new article to the database
         newArticle.save(function (err, savedArticle) {
            if (err) {
               res.redirect('/dashboard?msg=Error saving the article');
            } else {
               res.redirect('/dashboard?msg= request for adding Article has sent');

            }
         });
      })
      }
   });

})

app.get('/edit_articles/:id',checkSignIn, function (req, res) {

   Article.findById(req.params.id, function (err, response) {
      Category.find(function (err, data) {
         console.log(response)
      res.render('edit', { id: req.params.id, user_article : response.article, topic : response.topic,Data: data});
   });
});
});

app.post('/edit_articles/:id',checkSignIn, function (req, res) {
   Article.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, response) {
      if (err) { res.render('blog', { message: "Error in updating try again ", id: '', newArticle: Article.article }); }// render -> redirect
      else {
         res.redirect('/dashboard?msg= Article Updated!')
      }
   });
});



app.get('/delete_articles/:id', checkSignIn,function (req, res) {
   Article.findByIdAndRemove(req.params.id, function (err, response) {
      if (err) { res.render('blog', { message: "Error in deleting try again ", id: '', newArticle: Article.article }); }// render -> redirect
      else
         res.redirect('/dashboard?msg= Article Deleted!')
   });
});




module.exports = app;