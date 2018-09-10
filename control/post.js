const express = require('express');
class Post extends express.Router {
    constructor(){
        this.get('/',this.index) 
    }
    index(req, res, next){
        res.render('index', { title: 'Express' });
    }
}

module.exports = Post