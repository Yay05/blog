var express = require('express');
var bcrypt = require('bcrypt')

const app = express.Router();
var Database = require('../models/database');
var Article = require('../models/articles');
var Category = require('../models/category');

// var Person = require('./models/database');

app.use(function (req, res, next) { res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); next(); });

function checkSignIn(req, res, next) {
   if(!req.session.user){
      res.redirect('/?msg= error not logged in'); 
   }

   else if (req.session.user.privilege === 'admin') {
      next();     //If session exists, proceed to page
   }
    else {

      res.redirect('/?msg= unauthorized access');
      var err = new Error("Not logged in!");
      console.log(req.session.user);
      next(err);  //Error, trying to access unauthorized page!
   }
}



app.get('/admin', checkSignIn, function (req, res) {
    var Message = req.query.msg ;
    Database.find(function (err, response) {
       console.log(response)
       Article.find(function (err, article) {
       if (Message) {
          res.render('admin', { data: response, message : Message,article });
          console.log(Message);
       }
       else {
          res.render('admin', { data: response, message : '' ,article });
       }
    });
   });
 });

 app.get('/manageTopicManagers', checkSignIn, function (req, res) {
   var Message = req.query.msg;
   Database.find(function (err, response) {
      console.log(response)
      Article.find(function (err, article) {
      if (Message) {
         res.render('manage_topic_managers', { data: response,  message : Message,article });
         console.log(Message);
      }
      else {
         res.render('manage_topic_managers', { data: response,  message : '',article });
      }
   });
  });
});

app.get('/manageUsers', checkSignIn, function (req, res) {
   var Message = req.query.msg;
   Database.find(function (err, response) {
      console.log(response)
      Article.find(function (err, article) {
      if (Message) {
         res.render('manage_users', { data: response,  message : Message,article });
         console.log(Message);
      }
      else {
         res.render('manage_users', { data: response,  message : '',article });
      }
   });
  });
});

app.get('/addTopics', checkSignIn, function (req, res) {
   var Message = req.query.msg;
   Database.find(function (err, response) {
      console.log(response)
      Article.find(function (err, article) {
      if (Message) {
         res.render('add_topics', { data: response,  message : Message,article });
         console.log(Message);
      }
      else {
         res.render('add_topics', { data: response,  message : '',article });
      }
   });
  });
});

 
 app.get('/reject_user/:id',checkSignIn, function (req, res) {
    Database.findByIdAndUpdate(req.params.id, { status: 0 , rejectedBy : 'admin' }, function (err, response) {
       if (err) {
          Database.find(function (err, data) {
             res.render('manageUsers', { data });
          });
       }
       else {
 
          res.redirect('/manageUsers')
       }
    });
 });
 
 app.get('/accept_user/:id',checkSignIn, function (req, res) {
    Database.findByIdAndUpdate(req.params.id, { status: 1 ,rejectedBy : ''}, function (err, response) {
       if (err) {
          Database.find(function (err, data) {
             res.render('manageUsers', { data });
          });
       }
       else {
 
          res.redirect('/manageUsers')
       }
    });
 });
 
 // Database.findOne({ email: req.body.email }, (err, response) => {
 app.get('/profile/:id', function (req, res) {
    Database.findById(req.params.id, function (err, response) {
       console.log('database worked')
       if (err) {
          res.render('profile', { Response: response });
       }
       else {
          Article.find(function (err, data) {
             console.log(data)
             res.render('profile', { Response: response, Data: data });
          });
       }
    });
 });
 
 
 
 
 app.post('/add_category', checkSignIn,function (req, res) {
    var data = req.body;
    Category.findOne({ category: data.category }, (err, response) => {
       if (response) {
          res.redirect('/admin?msg= already exist');
       }
       else if (!data.category) {
          res.redirect('/admin?msg= enter category');
          // res.render('blog',{message: 'article is empty',id: u_id,newarticle :''})
       }
 
       else {
          const newCategory = new Category({
             category: data.category,
 
          });
 
          // Save the new article to the database
          newCategory.save(function (err, savedCategory) {
             if (err) {
                res.redirect('/admin?msg= error! category not added');
 
             } else {
                res.redirect('/admin?msg=  category  added');
             }
          });
       }
    });
 
 })

 
app.get('/add_topicManager',checkSignIn, function (req, res) {
    var Message = req.query.msg;
    Category.find(function (err, data) {
       if (Message) {
          res.render('topicmanager', { Message, Data: data });
          console.log(Message);
       }
       else {
          res.render('topicmanager', { Message: '', Data: data });
       }
    });
 });
 
 app.post('/add_topicManager',checkSignIn,  function (req, res) {
    var data = req.body;
    console.log(data);
    console.log(data.category);
    Database.findOne({ email: data.email }, (err, response1) => {
       Database.findOne({ id: data.category }, async (err, response2) => {
          if (response1) {
             res.redirect('/add_topicManager?msg= email already exist');
          }
 
          else if (response2) {
             res.redirect('/add_topicManager?msg= topic manager already exist');
          }
          else if (!data.category || !data.name || !data.email || !data.password || !data.cpassword) {
             res.redirect('/add_topicManager?msg= fill all details');
             // res.render('blog',{message: 'article is empty',id: u_id,newarticle :''})
          }
 
          else if (data.password != data.cpassword) {
             res.redirect('/add_topicManager?msg= password does not match');
             // res.render('blog',{message: 'article is empty',id: u_id,newarticle :''})
          }
 
          else {
            const hash =  await bcrypt.hash(data.password,10);
             var newPerson = new Database({
                name: data.name,
                email: data.email,
                password: hash,
                status: 2,
                privilege: 'topicManager',
                id: data.category,
                rating : 0,
                rejectedBy : '',
             });
             newPerson.save(function (err, person) {
                if (err)
                   res.redirect('/admin?msg= error adding topic manager');
                else
                   res.redirect('/admin?msg= new topic manager added');
             });
 
          }
       });
    });
 
 })
 
 app.get('/reject_topicManager/:id',checkSignIn, function (req, res) {
    Database.findByIdAndUpdate(req.params.id, { status: 0 ,rejectedBy : 'admin'}, function (err, response) {
       if (err) {
             res.redirect('/manageTopicManagers?msg= error rejecting topic manager');
       }
       else {
 
          res.redirect('/manageTopicManagers')
       }
    });
 });
 
 app.get('/accept_topicManager/:id',checkSignIn, function (req, res) {
    Database.findByIdAndUpdate(req.params.id, { status: 2 ,rejectedBy : ''}, function (err, response) {
       if (err) {
          res.redirect('/manageTopicManagers?msg= error rejecting topic manager');
       }
       else {
 
          res.redirect('/manageTopicManagers')
       }
    });
 });

module.exports = app;