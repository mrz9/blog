const Router = require('express').Router;
const Utils = require('./utils')
class Controller {
    constructor(){
        this.router = new Router();
        this.$utils = Utils;
        this._route();
    }
    _route(){
        this.router.get('/',function(req,res,next){
            res.send('hello');
        })
    }
}

module.exports = Controller