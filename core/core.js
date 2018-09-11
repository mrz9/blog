const path = require('path');

let APP_PATH = path.resolve(__dirname,'..');
let CONFIG_PATH  = path.resolve(APP_PATH,'./config');
let VERSION = '0.0.1';

const config = require(CONFIG_PATH);

module.exports = {
    APP_PATH,
    CONFIG_PATH,
    VERSION,
    config
}