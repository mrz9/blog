const Router = require('express').Router;
class Controller {
    constructor(){
        this.router = new Router();
        this._route();
    }
    _route(){
        console.log('do super router')
        this.router.get('/',function(req,res,next){
            res.send('hello');
        })
    }
}

module.exports = Controller