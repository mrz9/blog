class Middleware {
    constructor(){

    }
    checkAuth(){
        if(!this.req.session.user){
            this.res.send({code:-1,msg:'无权访问'})
            return false;
        }
        this.next();
    }
}
module.exports = Middleware;