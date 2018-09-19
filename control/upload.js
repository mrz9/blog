const Core = require('../core');
const multer  = require('multer');

let upload = multer({ dest: 'uploads/tmp' });
let upload_chunk = multer({
    dest:'uploads/tmp',
    filename:(req,file,cb)=>{
        console.log(file);
        // cb(null, file.fieldname + '-' + Date.now())
    }
})
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
    chunk(){
        let file = this.req.file;
        console.log(this.req.body);
        console.log('文件类型：%s', file.mimetype);
        console.log('原始文件名：%s', file.originalname);
        console.log('文件大小：%s', file.size);
        console.log('文件保存路径：%s', file.path);
        this.res.send({code:0,msg:'true'})
    }
}
module.exports = new Control().Router;