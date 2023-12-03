var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/blog');

var comment = mongoose.Schema({
    id : String,
    comment: String,
    name: String,
    date:  {
        type: Date,
        default :new Date(),
      },
   
    
 });
 var Comment = mongoose.model("Comment", comment);

 module.exports = Comment;         
