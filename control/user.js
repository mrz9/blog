const Core = require('../core');
const Model = require('../model/user');
class Control extends Core.Control {
    constructor(){
        super();
        this.model = new Model();
    }
    /**
     * 控制器的路由写在这里
     */
    _route(){
        this.router.get('/',this.index.bind(this))
        this.router.post('/login',this.login.bind(this))
    }
    /**
     * 控制器的处理方法
     */
    index(req,res,next){
        console.log('session test',req.session.test)
        req.session.test = {id:'1231',name:'z'};
        res.send('hell123123o');
    }
    async login(req,res,next){
        let {username,password} = req.body;
        if(!String(username).trim() || !String(password).trim()){
            res.send({code:-1,msg:'参数有误'})
        }else{
            let user = await this.model.$get_one(username,'username');
            if(!user.lenght === 0){
                
            }
            res.send(user);
        }

    }
}
module.exports = new Control().router;