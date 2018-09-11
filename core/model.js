const Core = require('./index');
const DB = require('./db');
class Model {
    constructor(){
        this.db = DB;
        //默认表名字是model的class的名字的小写
        this.prefix = Core.config.db.prefix || '';
        this.table_name = this.constructor.name.toLocaleLowerCase();
        this.limit = 25
        this.page = 1;
        this.primary_key = 'id';
    }
    /**
     * 
     * @param {Number} page 
     * @param {Object} where 
     */
    async page_data(page = 1,where={},orderBy = ""){
        let offset = this.limit * (page - 1);
        let where_str = '',where_val = [];

        if(toString.call(where) === '[object Object]'){
            where_str = Object.keys(where).map(key=>key += ' = ?'),
            values = Object.values(where);
        }
        
        let sql = `SELECT * from \`${this.prefix + this.table_name}\` limit ${offset},${this.limit} ${where_str ? 'WHERE ' + order_str : ''} ${orderBy ? 'ORDER BY ' + orderBy : ''}`;
        let rs = await this.db.query(sql,where_val);
        return rs;
    }
    /**
     * 
     * @param {Object} Bean 
     */
    async add(Bean){
        if(toString.call(Bean) !== '[object Object]'){
            throw new Error('error param')
        }
        let keys = Object.keys(Bean),
            values = Object.values(Bean);

        if(keys.length == 0){
            return false;
        }

        let sql = `INSERT INTO \`${this.prefix + this.table_name}\` (${keys.join(',')})`;
        let rs = await this.db.query(sql,values);
        return rs;
    }
    /**
     * 
     * @param {Object} Bean 
     * @param {Object} where 
     */
    update(Bean,where){
        if(toString.call(Bean) !== '[object Object]' || toString.call(where) !== '[object Object]'){
            throw new Error('error param')
        }
        if(typeof Bean[this.primary_key] !== 'undefined'){
            delete Bean[this.primary_key];
        }
        let keys = Object.keys(Bean),
            values = Object.values(Bean),
            wkeys = Object.keys(where),
            wvalues = Object.values(where);

        if(keys.length == 0){
            return false;
        }

        let set = keys.map(key=>key += ' = ?')
        let wset = wkeys.map(key=>key += ' = ?');

        let sql = `UPDATE \`${this.prefix + this.table_name}\` SET ${set.join(',')} where ${wset.join(',')}`;

        let rs = await this.db.query(sql,values.concat(wvalues));
        return rs;
    }

}

module.exports = Model