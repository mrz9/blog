const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const Core = require('../core');
const multer  = require('multer');

let upload = multer({ dest: 'uploads/tmp' });

let chunk_storage = multer.diskStorage({
    destination:function(req,file,cb){
        //后缀检测
        let suffix = req.body.filename.split('.');
        suffix = suffix.length >1 ? suffix.pop() : '';

        if(!suffix || Core.config.upload.allowed_types.split('|').indexOf(suffix.toLowerCase()) == -1){
            cb(new Error('上传格式不支持'))
            return;
        }

        /**
         * 注意，前端数据传输的顺序，需要guid在文件数据之前，否则body获取不了guid
         */
        if(req.body.guid){
            Core.utils.checkDirAndCreate(path.resolve(Core.utils.UPLOAD_PATH,'tmp'))
            Core.utils.checkDirAndCreate(path.resolve(Core.utils.UPLOAD_PATH,'tmp',req.body.guid))
            cb(null, `uploads/tmp/${req.body.guid}`)
        }else{
            cb(new Error('参数有误'))
        }
    },
    filename:(req,file,cb)=>{
        /**
         * 注意，前端数据传输的顺序，需要num在文件数据之前，否则body获取不了num
         */
        if(typeof req.body.num !== 'undefined'){
            cb(null, `${req.body.chunk_num}_${req.body.num}`)
        }else{
            cb(new Error('参数有误'))
        }
        
    }
})

let upload_chunk = multer({storage:chunk_storage})

class Middleware {
    constructor(){

    }
    upload(){
        return upload.single('file');
    }
    chunk(){
        return upload_chunk.single('file')
    }
    async fileCheck(){
        if(Core.config.upload.max_size !== 0 && Core.config.upload.max_size< this.req.file.size){
            this.res.send({code:-1,msg:'上传文件太大'});
            await Core.utils.unlinkTmpFile(this.req.file.path)
            return;
        }

        //后缀检测
        let suffix = this.req.file.originalname.split('.');
            suffix = suffix.length >1 ? suffix.pop() : '';

        if(!suffix || Core.config.upload.allowed_types.split('|').indexOf(suffix) == -1){
            this.res.send({code:-1,msg:'上传格式不支持'});
            await Core.utils.unlinkTmpFile(this.req.file.path)
            return;
        }
        this.next();
    }
}

module.exports = Middleware;