const Core = require('../core');
module.exports =  class Post extends Core.Model {
    constructor(){
        super();
    }
    async add(post){
        let rs = await this.$add(post);
        return rs;
    }
    async update(post,Where){
        post.update_time = parseInt(+new Date/1000);
        delete post.create_time;
        delete post.id;
        let rs = await this.$update(post,Where);
        return rs;
    }

    async get_list(page=1,where={},orderBy = ''){
        let rs = await this.$page_data(page,where,orderBy);
        return rs;
    }
    
    async delete(id){
        let post = await this.$get_one(id);
        if(post){
            post.status = -1;
            let rs = await this.update(post,{id:post.id});
            return rs;
        }else{
            return false;
        }
    }
}