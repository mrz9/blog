const Core = require('../core');
const Model = require('../model/post');
class Control extends Core.Control {
    constructor(){
        super();
        this.model = new Model();
    }
    index(t){
        this.res.send('post index');
    }
    async page(){
        let page = this.req.params.page || 1;
        if(isNaN(page)){
            this.res.send({code:-1,msg:'参数有误'})
        }else{
            let rs = await this.model.$page_data(this.req.params.page,{},'create_time DESC');
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
            this.res.send(result);
        }
    }
    async create(){
        let post = this.req.body;
        if(post.id) delete post.id;
        let rs = await this.model.add(post);
        if(rs.affectedRows){
            this.res.send({code:0,msg:'添加成功'})
        }else{
            this.res.send(rs);
        }
    }
    async edit(){
        let post = this.req.body;
        if(!this.req.params.id || post.id !== this.req.params.id){
            this.res.send({code:-1,msg:'参数有误'})
            return;
        }

        let rs = await this.model.update(post,{id:req.params.id})
        if(rs.affectedRows){
            this.res.send({code:0,msg:'更新成功'})
        }else{
            this.res.send(rs);
        }
    }
    async delete(){
        let id = this.req.params.id;
        if(!id || isNaN(id) ){
            this.res.send({code:-1,msg:'参数有误'})
            return;
        }
        let rs = await this.model.delete(id)
        if(rs.affectedRows){
            this.res.send({code:0,msg:'删除成功'})
        }else{
            this.res.send(rs);
        }
    }
}

module.exports = Control;
