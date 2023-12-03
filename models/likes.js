var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/blog');

var likes = mongoose.Schema({
    id: String,
    name : String,
    like : Number,
    totalLikes : Number,
    count : Number
 });
 var Likes = mongoose.model("Likes", likes);

 module.exports = Likes;         
