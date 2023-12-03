var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret: "Your secret key"}));
app.set('view engine','ejs');
app.set('views','./views');

var routes = require('./routes/routes');
app.use('/',routes);

app.listen(5000,function(req,res){
    console.log('server started');
}); 