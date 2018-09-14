var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('session_wrok'));
app.use(session({
    name:'_BLOG',
    secret: 'session_wrok',//与cookieParser中的一致
    resave: true,
    saveUninitialized:true,
    // cookie:{
    //     maxAge: 60 * 1000
    // }
   }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./control/index'));
app.use('/user',require('./control/user'));
app.use('/post',require('./control/post'));
app.use((err,req,res,next)=>{
    console.log('err',err);
    res.send({code:-1,msg:500});
})
module.exports = app;
