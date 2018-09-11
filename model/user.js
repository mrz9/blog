const Core = require('../core');
module.exports =  class User extends Core.Model {
    constructor(){
        super();
    }
    async add(User){
        let rs = await this.$add(User);
        return rs;
    }
    async update(User,Where){
        let rs = await this.$update(User,Where);
        return rs;
    }

    async get_list(){
        let rs = await this.$page_data(1,{id:2});
        return rs;
    }
    async delete(){
        let rs = await this.$delete({id:3,name:'node_2'});
        return rs;
    }
}