const Core = require('../core');
module.exports =  class User extends Core.Model {
    constructor(){
        super();
    }
    async login(user){
        user.last_login_time = parseInt(+new Date/1000);
    }
    async add(user){
        user.create_time = parseInt(+new Date/1000);
        let rs = await this.$add(user);
        return rs;
    }
    async update(user,Where){
        user.update_time = parseInt(+new Date/1000);
        delete user.create_time;
        delete user.id;
        let rs = await this.$update(user,Where);
        return rs;
    }

    async get_list(page=1,where={},orderBy = ''){
        let rs = await this.$page_data(page,where,orderBy);
        return rs;
    }
}