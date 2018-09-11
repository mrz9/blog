const db = require('./db.js');
class Model {
    constructor(){
        this.db = db
    }
}

module.exports = Model