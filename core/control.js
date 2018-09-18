const Router = require('./router');
const Utils = require('./utils')
class Controller {
    constructor(){
        this.router = new Router(this);
        this.$utils = Utils;
        this._route();
    }
    $getRouter(){
        return this.router.router
    }
    _route(){
        this.router.get('/',function(req,res,next){
            res.send('hello');
        })
    }
}

module.exports = Controller