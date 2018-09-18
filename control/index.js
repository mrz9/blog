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
    index(){
        this.res.send('home index');
    }
    login(){

    }
    logout(){}
    add(){}
    edit(){

    }
    delete(){}
}
module.exports = new Control().Router;