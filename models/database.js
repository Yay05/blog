var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/blog');

var blog = mongoose.Schema({
    name: String,
    email: String,
    password : String,
    status : Number,
    privilege: String,
    id : String,
    rating: Number
    
 });
 var Database = mongoose.model("Blog", blog);

 module.exports = Database;         
