const Router = require('express').Router;
class Controller {
    constructor(){
        this.router = new Router();
        this._route();
    }
    _route(){
        this.router.get('/',function(req,res,next){
            res.send('hello');
        })
    }
}

module.exports = Controller