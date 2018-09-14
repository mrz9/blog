const Core = require('../core');
class Control extends Core.Control {
    constructor(){
        super();
    }
    /**
     * 控制器的路由写在这里
     */
    _route(){
        this.router.get('/',this.index)
    }
    /**
     * 控制器的处理方法
     */
    index(req,res,next){
        res.send('home index');
    }
    login(req,res,next){

    }
    logout(req,res,next){}
    add(req,res,next){}
    edit(req,res,next){

    }
    delete(req,res,next){}
}
module.exports = new Control().router;