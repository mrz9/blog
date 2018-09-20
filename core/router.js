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
                    return await handle.call(this.app,req,res,next);
                    // this.co(handle,req,res,next).catch(e=>{
                    //     console.log('m co ',e)
                    //     next(e);
                    // })
                }catch(e){
                    console.log('m next',e)
                    next(e);
                }
            });
        };

        
        middleware.push(async (req,res,next)=>{
            try{
                this.app.req = req;
                this.app.res = res;
                this.app.next = next;
                return await cb.call(this.app,req,res,next);

                // this.co(cb,req,res,next).catch(e=>{
                //     console.log('co',e)
                //     return next(e);
                // })
            }catch(e){
                console.log('next',e)
                return next(e);
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
            let rs = await cb.call(this.app,req,res,next);
            resolve(rs)
        })
    }
}

module.exports = Router
