const core = require('./index');

class Router {
    constructor(app){
        this.routeConfig = core.routes;
        this.app = app;
        
        //绑定路由
        this.bindRoute();
    }
    bindRoute(){
        Object.keys(this.routeConfig).forEach((url,idx)=>{
            let routeItem = this.routeConfig[url];
            switch(toString.call(routeItem)){
                case "[object String]"://字符串时表示get请求，且只有控制器
                    this.app.get(url,this.getMiddleware([routeItem]))
                    break;
                case "[object Object]":
                    break;
                case "[object Array]"://[method,[middleware],control]
                    let [method,middlewares,control=[]] = routeItem;
                    if(toString.call(middlewares) !== "[object Array]") middlewares = [middlewares]
                    let mehtods = this.getMiddleware(middlewares.concat(control));
                    this.app[method](url,...mehtods)
                    break;
                default:
                    throw new TypeError('路由不支持')
                    break;

            }
        })
    }
    getMiddleware(middlewares){
        let rs = [];
        for (let i = 0; i < middlewares.length; i++) {
            let type = 'm';
            let item = middlewares[i];
            if(i === middlewares.length -1) type = 'c';
            
            rs.push(async (req,res,next)=>{
                try{
                    let [app,handle] = core.utils.matchRouteMethod(item,type);

                    app.req = req;
                    app.res = res;
                    app.next = next;
                    await handle.call(app,req,res,next);
                }catch(e){
                    next(e);
                }
            });
        };
        return rs;
    }
}

module.exports = Router
