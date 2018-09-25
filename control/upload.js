const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const Core = require('../core');

class Control extends Core.Control {
    constructor(){
        super();
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
    
    async upload(){
        let dist = await this.$utils.saveTmpFile(this.req.file);
        this.res.send({code:0,msg:this.req.file,link:dist})
    }
    async chunk(req,res,next){
        try{
            let hasDone = false; //是否已经合并完成
            //后缀检测
            let suffix = this.req.body.filename.split('.');
            suffix = suffix.length >1 ? suffix.pop() : '';
            // let name = crypto.pseudoRandomBytes(16).toString('hex') + '.' + suffix;
            let name = this.req.body.guid + '.' + suffix;

            let dist = path.resolve(this.$utils.UPLOAD_PATH,'tmp',name);
            if(!fs.existsSync(dist) && !hasDone){
                hasDone = true;

                let chunkList = fs.readdirSync(path.resolve(this.$utils.UPLOAD_PATH,'tmp',this.req.body.guid));
                //检查分片是否都上传成功
                let chunk_path = path.resolve(this.$utils.UPLOAD_PATH,'../',this.req.file.path,'../');
                
                await pipeChunk(dist,chunk_path,this.req.body.chunk_num,0);
                
                //复制文件到对应目录
                let save_path = await this.$utils.saveTmpFile({
                    originalname:name,
                    filename:this.req.body.guid,
                    path:dist
                });
                this.res.send({code:0,msg:'上传成功',link:dist})
            }else{
                this.res.send({code:0,msg:'true'})
            }
        }catch(e){
            this.next(e);
        }
    }
}


function pipeChunk(dist,file_path,max,num){
    return new Promise((resolve,reject)=>{
        let src = path.resolve(file_path,`${max}_${num}`);
        let ws = fs.createWriteStream(dist,{'flags': 'a'});
        fs.createReadStream(src).pipe(ws)
        ws.on('finish',async ()=>{
            //成功后需要删除临时文件
            fs.unlink(src, (e) => {
                if (e) {
                    console.log(e)
                }
            });
            if(max-1>num){
                resolve(await pipeChunk(dist,file_path,max,++num))
            }else{
                //所有文件都成功后，删除临时目录
                fs.rmdir(file_path, (e) => {
                    if (e) {
                        console.log(e);
                    }
                });
                resolve(true)
            }
        })
    })
    
}
module.exports = Control;