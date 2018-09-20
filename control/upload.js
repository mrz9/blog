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

        if(!suffix || Core.config.upload.allowed_types.split('|').indexOf(suffix) == -1){
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

class Control extends Core.Control {
    constructor(){
        super();
    }
    /**
     * 控制器的路由写在这里
     */
    _route(){
        this.router.post('/upload',upload.single('file'),this.fileCheck,this.upload)
        this.router.post('/chunk',upload_chunk.single('file'),this.chunk)
    }
    /**
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
    async fileCheck(){
        if(this.$core.config.upload.max_size !== 0 && this.$core.config.upload.max_size< this.req.file.size){
            this.res.send({code:-1,msg:'上传文件太大'});
            await this.$utils.unlinkTmpFile(this.req.file.path)
            return;
        }

        //后缀检测
        let suffix = this.req.file.originalname.split('.');
            suffix = suffix.length >1 ? suffix.pop() : '';

        if(!suffix || this.$core.config.upload.allowed_types.split('|').indexOf(suffix) == -1){
            this.res.send({code:-1,msg:'上传格式不支持'});
            await this.$utils.unlinkTmpFile(this.req.file.path)
            return;
        }
        this.next();
    }
    async upload(){
        let dist = await this.$utils.saveTmpFile(this.req.file);
        this.res.send({code:0,msg:this.req.file,link:dist})
    }
    async chunk(){
        try{
            let hasDone = false; //是否已经合并完成
            //后缀检测
            let suffix = this.req.body.filename.split('.');
            suffix = suffix.length >1 ? suffix.pop() : '';
            // let name = crypto.pseudoRandomBytes(16).toString('hex') + '.' + suffix;
            let name = this.req.body.guid + '.' + suffix;

            let dist = path.resolve(this.$utils.UPLOAD_PATH,'tmp',name);
            if(!fs.existsSync(dist) && !hasDone){
                let chunkList = fs.readdirSync(path.resolve(this.$utils.UPLOAD_PATH,'tmp',this.req.body.guid));
                //检查分片是否都上传成功
                let chunk_path = path.resolve(this.$utils.UPLOAD_PATH,'../',this.req.file.path,'../');
                
                pipeChunk(dist,chunk_path,this.req.body.chunk_num,0);
                
                //复制文件到对应目录
                let save_path = await this.$utils.saveTmpFile({
                    originalname:name,
                    filename:this.req.body.guid,
                    path:dist
                });
                hasDone = true;
                return this.res.send({code:0,msg:'上传成功',link:dist})
            }else{
                return this.res.send({code:0,msg:'true'})
            }
        }catch(e){
            return this.next(e);
        }
    }
}


function pipeChunk(dist,file_path,max,num){
    let src = path.resolve(file_path,`${max}_${num}`);
    let ws = fs.createWriteStream(dist,{'flags': 'a'});
    fs.createReadStream(src).pipe(ws)
    ws.on('finish',()=>{
        //成功后需要删除临时文件
        fs.unlink(src, (e) => {
            if (e) {
                console.log(e)
            }
        });
        if(max-1>num){
            pipeChunk(dist,file_path,max,++num)
        }else{
            //所有文件都成功后，删除临时目录
            fs.rmdir(file_path, (e) => {
                if (e) {
                    console.log(e);
                }
            });
        }
    })
}
module.exports = new Control().Router;