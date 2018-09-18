const Router = require('./router');
const Utils = require('./utils')
class Controller {
    constructor(){
        this.router = new Router(this);
        this.Router = this.router.router
        this.$utils = Utils;
        this._route();
    }
    $getRouter(){
        return this.router.router
    }
    _route(){
        this.router.get('/',()=>{
            this.res.send('hello');
        })
    }
}

module.exports = Controller