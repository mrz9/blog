const Core = require('./index');
const Utils = require('./utils')
class Controller {
    constructor(){
        this.$core = Core;
        this.$utils = Utils;
    }
}

module.exports = Controller