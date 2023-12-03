var express = require('express');

const app = express.Router();
var Database = require('../models/database');
var Article = require('../models/articles');
var Likes = require('../models/likes');
var Comment = require('../models/comment');




app.get('/view_more/:id', function (req, res) {
   var id = req.params.id;
   var CurrentTime = new Date();
   var Name =  req.session.user.name;  
   var count = req.session.count ;
  
   Article.find(function (err, response) {
      Comment.find(function (err, data) {
         Likes.find(function (err, likes) {
            Likes.findOne({ id: req.params.id, name: req.session.user.name },{  count: 1} ,{ new: true },function (err, result) {
               console.log(result)
               console.log(id)
               console.log(Name)
               console.log('hhsfhasdkahf')
            if(count){
               res.render('view_more', { articles: response, id, comments: data, CurrentTime ,likes,Name,Count : count ,User : req.session.user.privilege});
               console.log('lol')
            }

            else if(result){
               res.render('view_more', { articles: response, id, comments: data, CurrentTime ,likes,Name,Count : result.count ,User : req.session.user.privilege});
               console.log('lolol');
               console.log(result)
            }
               else
            {
               res.render('view_more', { articles: response, id, comments: data, CurrentTime ,likes,Name,Count : '',User : req.session.user.privilege});
               console.log('lololol')
            }
        
      });
   });
   });
   });
});



app.post('/view_more/:id', function (req, res) {
   var data = req.body;
   var u_id = req.params.id;  
   if (!data.Comments) {
      res.redirect('/view_more/' + u_id)
   }

   else {

    

         const newComment = new Comment({
            id: u_id,
            comment: data.Comments,
            name: req.session.user.name,
            date: new Date(),
           
            
         });

         // Save the new article to the database
         newComment.save(function (err, savedArticle) {


            if (err) {
               res.redirect('/view_more/' + u_id);
            } else {
               res.redirect('/view_more/' + u_id);

            }

         });

         
     
   }
})





app.get('/add_like/:id', function (req, res) {
   var  name = req.session.user.name ;
   Likes.findOne( { id: req.params.id , name} ,{ new: true },function (err, response) {
      console.log('gg')
      console.log(response)
      console.log(req.params.id)
      console.log('worked1')
      if (err) {
         res.redirect('/view_more/'+ req.params.id);
      }
      else if(!response){
         Likes.count({},function(err,countRes){
            if(err){
               console.log('error');
            }
            else{
               console.log(countRes);
            }
            const newLikes = new Likes({
               id: req.params.id ,
               name: req.session.user.name,
               like : 1,
               totalLikes : 1,
               count : countRes + 1
               
            });
   
            // Save the new article to the database
            newLikes.save(function (err, data) {
               if (err) {
                  res.redirect('/view_more/' +  req.params.id);
               } else {
                  req.session.count = newLikes.count;
                  res.redirect('/view_more/' +  req.params.id);
                  console.log('again')
   
               }
   
            });   
         });
         Article.findByIdAndUpdate(req.params.id, { $inc: { totalLikes: 1 } }, { new: true }, function (err, response) {
              console.log(response);
          });
          
         
      }
      else if(response){
         var  name = req.session.user.name ;
         Likes.findOneAndUpdate( { id: req.params.id,name },   { $set: { like: 1 }, $inc: { totalLikes: +1 } }, { new: true },function (err, data) { //, total_likes : total_likes - 1
            console.log(data)
            console.log('worked6')
            console.log(req.params.id)
            if (err) {
               res.redirect('/view_more/'+ req.params.id);
            }
            else {
               req.session.count = data.count;
               res.redirect('/view_more/'+ req.params.id);
               console.log('worked5');
               Article.findByIdAndUpdate(req.params.id, { $inc: { totalLikes: 1 } }, { new: true }, function (err, response) {
                  console.log(response)
                });
                
            }
         });
      }
      else {
         
         res.redirect('/view_more/'+ req.params.id);
         console.log('worked2')
      }
   });
});



app.get('/remove_like/:id', function (req, res) {
   var  name = req.session.user.name ;
   Likes.findOneAndUpdate( { id: req.params.id,name },   { $set: { like: 0 }, $inc: { totalLikes: -1 } }, { new: true },function (err, data) { //, total_likes : total_likes - 1
      console.log(data)
      console.log('worked3')
      console.log(req.params.id)
      if (err) {
         res.redirect('/view_more/'+ req.params.id);
      }
      else {
         req.session.count = data.count;
         res.redirect('/view_more/'+ req.params.id);
         console.log('worked4');
         Article.findByIdAndUpdate( req.params.id, { $inc: { totalLikes: -1 } }, { new: true }, function (err, response) {
              console.log(response);
          });
          
      }
   });



});

module.exports = app;