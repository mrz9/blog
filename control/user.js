const Controller = require('../core/controller');
class Control extends Controller {
    constructor(){
        super();
    }
    /**
     * 控制器的路由写在这里
     */
    _route(){
        console.log(this.app);
        this.router.get('/',this.index)
    }
    /**
     * 控制器的处理方法
     */
    index(req,res,next){
        res.send('hell123123o');
    }
}
module.exports = new Control().router;