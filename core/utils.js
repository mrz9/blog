const crypto = require('crypto');
const toString = Object.prototype.toString;
const isArray = Array.isArray;
const isBuffer = Buffer.isBuffer;
const numberReg = /^((\-?\d*\.?\d*(?:e[+-]?\d*(?:\d?\.?|\.?\d?)\d*)?)|(0[0-7]+)|(0x[0-9a-f]+))$/i;

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
 * 返回两个数间的随机数
 * @param {*} min 
 * @param {*} max 
 */
function rand(min,max){
    return (min + Math.round(Math.random()*(max-min)));
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

/**
 * 判断是否为数值类型
 * @param {*} obj 
 */
function isNumber(obj) {
    return numberReg.test(obj);
};

/**
 * 判断是否为整型
 * @param {*} obj 
 */
function isInt(obj) {
    return /^\d+$/.test(obj);
};

/**
 * 判断是否为函数
 * @param {*} obj 
 */
function isFunction(obj) {
    return typeof obj === 'function';
};

/**
 * 判断是否为布尔类型
 * @param {*} obj 
 */
function isBoolean(obj) {
    return toString.call(obj) === '[object Boolean]';
};

/**
 * 判断是否为日期类型
 * @param {*} str 
 */
function isDate(str){
    var tmp = new Date(str);
    return (tmp == 'Invalid Date') ? false : true;
}

/**
 * 去除字符串的前后空格
 * @param {*} str 
 */
function trim(str){
    return (isString(str)) ? str.trim() : str;
}

/**
 * 判断传入类型是否为空 数值类型时，0也是空
 * @param {*} obj 
 */
function isEmpty(obj){
    if (isObject(obj)) {
        for (let key in obj) {
            return !key && !0;
        }
        return true;
    } else if (isArray(obj)) {
        return obj.length === 0;
    } else if (isString(obj)) {
        return obj.length === 0;
    } else if (isNumber(obj)) {
        return obj === 0;
    } else if (obj === null || obj === undefined) {
        return true;
    } else if (isBoolean(obj)) {
        return !obj;
    }
    return false;

}


module.exports = {
    md5,
    randomString,
    rand,
    isObject,
    isEmpty,
    isArray,
    isNumber,
    isString,
    isBoolean,
    isBuffer,
    isFunction,
    isInt,
    isDate,
    trim
}