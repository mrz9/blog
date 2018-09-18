const expressRouter = require('express').Router;

class Router {
    constructor(app){
        this.app = app;
        this.router = new expressRouter();
    }
    _route(){
        let args = Array.prototype.slice.call(arguments);
        let method = args.shift();
        let path = args.shift();
        let cb = args.pop();
        let middleware = [];
        for (var i = 0; i < args.length; i++) {
            let handle = args[i];
            if (typeof handle !== 'function') {
                let type = toString.call(handle);
                let msg = 'Route.' + method + '() requires a callback function but got a ' + type
                throw new Error(msg);
            }
            middleware.push((req,res,next)=>{
                try{
                    this.app.req = req;
                    this.app.res = res;
                    this.app.next = next;
                    handle.call(this.app);
                }catch(e){
                    res.send({code:500,msg:e.message});
                }
            });
        };

        
        middleware.push((req,res,next)=>{
            try{
                this.app.req = req;
                this.app.res = res;
                this.app.next = next;
                cb.call(this.app);
            }catch(e){
                res.send({code:500,msg:e.message});
            }
        })

        this.router[method](path,...middleware)
    }
    get(){
        this._route('get',...arguments)
    }
    post(){
        this._route('post',...arguments)
    }
}

module.exports = Router
