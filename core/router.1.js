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
                next(new Error(msg));
            }
            middleware.push(async (req,res,next)=>{
                try{
                    this.app.req = req;
                    this.app.res = res;
                    this.app.next = next;
                    await handle.call(this.app,req,res,next);
                }catch(e){
                console.log('err',e)
                    next(e);
                }
            });
        };

        
        middleware.push(async (req,res,next)=>{
            try{
                this.app.req = req;
                this.app.res = res;
                this.app.next = next;
                await cb.call(this.app,req,res,next);
            }catch(e){
                console.log('err',e)
                next(e);
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
    co(cb,req,res,next){
        return new Promise(async (resolve,reject)=>{
            resolve(cb.call(this.app,req,res,next))
        })
    }
}

module.exports = Router
