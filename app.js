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
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

app.use('/', require('./control/index'));
app.use('/user',require('./control/user'));
app.use('/post',require('./control/post'));
app.use('/upload',require('./control/upload'));

app.use((err,req,res,next)=>{
    if(err.stack){
        console.log(err)
        res.send({code:500,msg:err.message,type:'global'});
        return;
    }
    next();
})
module.exports = app;
