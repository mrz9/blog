const path = require('path');

let APP_PATH = path.resolve(__dirname,'..');
let CONFIG_PATH  = path.resolve(APP_PATH,'./config');

exports.VERSION = '0.0.1';
exports.APP_PATH = APP_PATH;
exports.CONFIG_PATH = CONFIG_PATH;
exports.config = require(CONFIG_PATH);

exports.Model = require('./model')
exports.Control = require('./control')

