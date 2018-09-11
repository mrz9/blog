const Core = require('../core');
module.exports =  class User extends Core.Model {
    constructor(){
        super();
        this.prefix = 'mrz_'
        // this.table_name = 'new_change_new'
    }
    add(User){
    }
}