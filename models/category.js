var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/blog');

var category = mongoose.Schema({
    category: String,
 });
 var Category = mongoose.model("Category", category);

 module.exports = Category;         
