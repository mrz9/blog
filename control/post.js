const Core = require('../core');
const Model = require('../model/post');
class Control extends Core.Control {
    constructor(){
        super();
        this.model = new Model();
    }
    _route(){
        this.router.get('/',this.index.bind(this)) 
        this.router.post('/create',this.create.bind(this)) 
        this.router.get('/edit/:id',this.edit.bind(this)) 
        this.router.get('/delete/:id',this.delete.bind(this)) 
        this.router.get('/page/:page',this.page.bind(this)) 
    }
    index(req, res, next){
        res.send('post index');
    }
    async page(req,res,next){
        let page = req.params.page || 1;
        if(isNaN(page)){
            this.send({code:-1,msg:'参数有误'})
        }else{
            let rs = await this.model.$page_data(req.params.page,{},'create_time DESC');
            let result = {code:0,data:[]}
            if(rs && rs.length>0){
                result.data = rs.map(item=>{
                    return {
                        id:item.id,
                        title:item.title,
                        time:item.create_time,
                        content:item.content
                    }
                })
            }
            res.send(result);
        }
    }
    async create(req, res, next){
        let post = req.body;
        if(post.id) delete post.id;
        let rs = await this.model.add(post);
        if(rs.affectedRows){
            res.send({code:0,msg:'添加成功'})
        }else{
            res.send(rs);
        }
    }
    edit(req,res,next){
        res.send('post edit')
    }
    delete(req,res,next){
        res.send(`pst delete ${req.params.id}`)
    }
}

module.exports = new Control().router;
