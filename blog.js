var express = require('./.gitignore/node_modules/express');
var bodyParser = require('./.gitignore/node_modules/body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views','./views');

var register = require('./register');
app.use('/',register);


const dashboard = require('./dashboard');

app.use('/dashboard', dashboard);

app.listen(5000,function(req,res){
    console.log('server started');
}); 