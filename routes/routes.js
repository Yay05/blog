var express = require('express');
const app = express.Router();
var bcrypt = require('bcrypt');

var sign_in = require('./sign_in');
var register1 = require('./resigter');
var user_dashboard = require('./user_dashboard');
var admin_dashboard = require('./admin_dashboard');
var logout = require('./logout');
var topicManager_dashboard = require('./topic_manager')
var view_more = require('./view_more')
var dashboard = require('./dashboard')



app.use('/',dashboard);
app.use('/',sign_in);
app.use('/',register1);
app.use('/',user_dashboard);
app.use('/',admin_dashboard);
app.use('/',logout);
app.use('/',topicManager_dashboard);
app.use('/',view_more);

app.use(express.static('css'));
app.use(express.static('images'));
app.use(express.static('uploads'));

module.exports = app;