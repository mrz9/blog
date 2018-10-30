const Core = require('../core');
const Model = require('../model/user');

class Control extends Core.Control {
    constructor(){
        super();
        this.model = new Model();
    }
    async index(){
        try{
            this.res.send(this.req.session);
        }catch(e){
            this.next(e);
        };
        
    }
    async add(){
        let {username,password,recheck_password} = this.req.body;
        if(password !== recheck_password){
            this.res.send({code:-1,msg:'两次输入密码不一样'})
            return false;
        }
        if(!String(username).trim() || !String(password).trim()){
            this.res.send({code:-1,msg:'参数有误'})
        }else{
            let user = await this.model.$get_one(username,'username');
            if(user){
                this.res.send({code:-1,msg:'用户已存在'});
            }else{
                let user = {};
                user.username = username;
                user.password = password;
                user.loginip = this.req.ip;
                let rs = await this.model.add(user);
                this.res.send(rs);
            }
        }
    }
    async login(req,res){
        let {username,password} = req.body;
        if(!String(username).trim() || !String(password).trim()){
            res.send({code:-1,msg:'参数有误'})
        }else{
            let user = await this.model.$get_one(username,'username');
            if(!user){
                res.send({code:-1,msg:'用户名或密码错误'});
            }else{
                let md5 = this.$utils.md5(password+user.salt)
                if(user.password !== md5){
                    res.send({code:-1,msg:'用户名或密码错误'});
                    return false;
                }
                if(user.status !== 1){
                    res.send({code:-1,msg:'用户不可用'});
                    return false;
                }

                req.session.user = {
                    id:user.id,
                    name:user.username,
                    status:user.status,
                }

                user.loginip = req.ip;
                user.last_login_time = parseInt(+new Date/1000);
                await this.model.update(user,{id:user.id});
                res.send({code:0,msg:'登录成功'});
            }
        }

    }
    logout(){
        if(this.req.session.user){
            delete this.req.session.user;
        }
        this.res.send({code:0,msg:'退出成功'});
    }
}

module.exports = Control;