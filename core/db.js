const mysql = require('mysql');
const core = require('./index');

let pool = mysql.createPool({
    connectionLimit : 20,
    host : core.config.db.host,
    user : core.config.db.user,
    password : core.config.db.password,
    database : core.config.db.database
})

const _query = function(sql,fields){
    return new Promise((resolve,reject)=>{
        pool.query(sql,fields,(err,results,fields)=>{
            if(err) reject(err);
            resolve(results);
        })
    })
}



module.exports = {
    pool,
    query:_query
}