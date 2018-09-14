const crypto = require('crypto');

/**
 * 
 * @param {*} str 需要加密的字符串
 */
function md5(str){
    let md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
}

/**
 * 生成指定长度的随机字符串
 * @param {Number} num 
 */
function randomString(num){
    num = num || 6;
    var str = '';
    for(var i=0;i<num;i++){
        str += String.fromCharCode(rand(33,126));//根据ASCII码(33-126)
    }
    return str;
} 

/**
 * 判断是否为object类型
 * @param {*} obj 
 */
function isObject(obj){
    if (isBuffer(obj)) {
        return false;
    }
    return toString.call(obj) === '[object Object]';
}

/**
 * 判断是否为string类型
 * @param {*} obj 
 */
function isString(obj){
    return toString.call(obj) === '[object String]';
}

var isNumber = function(obj) {
    return numberReg.test(obj);
};

var isInt = function(obj) {
    return /^\d+$/.test(obj);
  };


module.exports = {
    md5,
    randomString,

}