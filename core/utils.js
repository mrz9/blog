const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const moment = require('moment')

const toString = Object.prototype.toString;
const isArray = Array.isArray;
const isBuffer = Buffer.isBuffer;
const numberReg = /^((\-?\d*\.?\d*(?:e[+-]?\d*(?:\d?\.?|\.?\d?)\d*)?)|(0[0-7]+)|(0x[0-9a-f]+))$/i;

const APP_PATH  = path.resolve(__dirname,'../');
const UPLOAD_PATH = path.resolve(APP_PATH,'./uploads');
const IMAGE_UPLOAD_PATH = path.resolve(UPLOAD_PATH,'./images');
const FILE_UPLOAD_PATH = path.resolve(UPLOAD_PATH,'./files');

const CONTROL_PATH = path.resolve(APP_PATH,'./control');
const MIDDLEWARE_PATH = path.resolve(APP_PATH,'./middleware');

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

/**
 * 保存临时文件
 * @param {*} file 
 * @param {*} name //保存的文字
 * 
 * {
    "fieldname": "file",
    "originalname": "2.5M.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "uploads/tmp",
    "filename": "a539ccdbea234d3b46627864be0c2025",
    "path": "uploads/tmp/a539ccdbea234d3b46627864be0c2025",
    "size": 2456281
  }
 */
function saveTmpFile(file,name){
    return new Promise((resolve,reject)=>{
        if(!name){
            let suffix =  file.originalname.split('.');
            suffix = suffix.length >1 ? '.' + suffix.pop() : '';
            name = file.filename + suffix;
        }
        
        let src = path.resolve(APP_PATH,file.path)
        let savePath = path.resolve(IMAGE_UPLOAD_PATH,moment().format('YYYYMMDD'));
        checkDirAndCreate(savePath);
        let dist = path.resolve(savePath,name);
        if(fs.existsSync(src)){
            try{
                let ws = fs.createWriteStream(dist)
                fs.createReadStream(src).pipe(ws).on('error',reject);
                ws.on('finish',()=>{
                    //成功后需要删除临时文件
                    fs.unlink(src, (err) => {
                        if (err) throw err;
                    });
                    resolve(dist);
                }).on('error',reject);
            }catch(e){
                reject(e);
            }
        }else{
            reject(new Error(`${file.path} 不存在`))
        }
    })
}

/**
 * 检测目录是否存在，没有则创建
 * @param {path} dir 
 */
function checkDirAndCreate(dir){
    try{
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }catch(e){
        throw e;
    }
}

/**
 * 删除tmp下的临时文件
 * @param {*} tmpPath tmp目录文件
 */
function unlinkTmpFile(tmpPath){
    return new Promise((resolve,reject)=>{
        fs.unlink(path.resolve(APP_PATH,tmpPath), (err) => {
            if (err) reject(err);
            resolve(1);
        });
    })
}
/**
 * 根据提供的路径返回对应的实例
 * @param {String} srt 路径
 * @param {String} type 类型 c:control or m:middleware
 */
function matchRouteMethod(str,type){
    let md;
    
    let [filePath,methodName] = (()=>{
        let arr = str.split('.');
        let mn = arr.pop();
        let path = arr.join('/');
        return [path,mn];
    })()

    switch(type){
        case 'c':
            md = require(path.resolve(CONTROL_PATH,filePath+'.js'))
            break;
        case 'm':
            md = require(path.resolve(MIDDLEWARE_PATH,filePath+'.js'))
            break;
        default:
            throw new TypeError('类型不存在');
            return;
    }
    let instance = new md();
    return [instance,instance[methodName]];
}

checkDirAndCreate(UPLOAD_PATH);
checkDirAndCreate(IMAGE_UPLOAD_PATH);
checkDirAndCreate(FILE_UPLOAD_PATH);

module.exports = {
    APP_PATH,
    UPLOAD_PATH,
    IMAGE_UPLOAD_PATH,
    FILE_UPLOAD_PATH,
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
    trim,
    saveTmpFile,
    checkDirAndCreate,
    unlinkTmpFile,
    matchRouteMethod
}