var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/blog');

var articles = mongoose.Schema({
    id: String,
    name : String,
    article: String,
    category: String,
    topic:String,
    isAccepted: Number,
    isRejected: Number,
    count : Number,
    totalLikes : Number,
    
 });
 var Article = mongoose.model("Article", articles);

 module.exports = Article;         
