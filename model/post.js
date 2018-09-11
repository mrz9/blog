const Core = require('../core');
module.exports =  class Post extends Core.Model {
    constructor(){
        super();
        /**
        this.id    //id
        this.type // 分类
        this.status  //状态
        this.content   //内容
        this.cover    //封面图
        this.author   //作者信息
        this.origin   //文章来源
        this.create_time  //创建时间
        this.update_time   //最后更新时间
        */

    }
    async add(post){
        let rs = await this.$add(post);
        return rs;
    }
    async update(post,Where){
        let rs = await this.$update(post,Where);
        return rs;
    }

    async get_list(page=1,where={},orderBy = ''){
        let rs = await this.$page_data(page,where,orderBy);
        return rs;
    }
}