const core = require('./index');
const expressRouter = require('express').Router;

class Router {
    constructor(){
        this.routeConfig = core.routes;
        this.router = new expressRouter();
        
        //绑定路由
        this.bindRoute();
    }
    bindRoute(){
        Object.keys(this.routeConfig).forEach((url,idex)=>{
            let routeItem = this.routeConfig[url];
            switch(toString.call(routeItem)){
                case "[object String]"://字符串时表示get请求，且只有控制器
                    this.router.get(url,core.utils.matchRouteMethod(routeItem,'c')[1])
                    break;
                case "[object Object]":
                    break;
                case "[object Array]"://[method,[middleware],control]
                console.log(routeItem)
                    let [method,middlewares,control=[]] = routeItem;
                    if(toString.call(middlewares) !== "[object Array]") middlewares = [middlewares]
                    let mehtods = this.getMiddleware(middlewares.concat(control));
                    this.router[method](url,...mehtods)
                    break;
                default:
                    throw new TypeError('路由不支持')
                    break;

            }
        })
    }
    getMiddleware(middlewares){
        console.log(middlewares);
        let rs = [];
        for (let i = 0; i < middlewares.length; i++) {
            let type = 'm';
            let item = middlewares[i];
            if(i === middlewares.length -1) type = 'c';
            console.log(item);
            let [app,handle] = core.utils.matchRouteMethod(item,type);
            if (typeof handle !== 'function') {
                let type = toString.call(handle);
                let msg = 'Route.' + method + '() requires a callback function but got a ' + type
                next(new Error(msg));
            }
            rs.push(async (req,res,next)=>{
                try{
                    app.req = req;
                    app.res = res;
                    app.next = next;
                    await handle.call(app,req,res,next);
                }catch(e){
                console.log('err',e)
                    next(e);
                }
            });
        };
        return rs;
    }
}

module.exports = Router
