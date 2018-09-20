var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

const fs = require('fs')
const crypto = require('crypto')
const multer  = require('multer');
const $utils = require('./core/utils')

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('session_wrok'));
app.use(session({
    name:'_BLOG',
    secret: 'session_wrok',//与cookieParser中的一致
    resave: true,
    saveUninitialized:true,
    // cookie:{
    //     maxAge: 60 * 1000
    // }
}))

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));


let chunk_storage = multer.diskStorage({
    destination:function(req,file,cb){
        //后缀检测
        let suffix = req.body.filename.split('.');
        suffix = suffix.length >1 ? suffix.pop() : '';

       

        /**
         * 注意，前端数据传输的顺序，需要guid在文件数据之前，否则body获取不了guid
         */
        if(req.body.guid){
            $utils.checkDirAndCreate(path.resolve($utils.UPLOAD_PATH,'tmp'))
            $utils.checkDirAndCreate(path.resolve($utils.UPLOAD_PATH,'tmp',req.body.guid))
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


app.use('/upload/chunk',upload_chunk.single('file'),async (req,res,next)=>{
    await handle(req,res,next)
});

app.use((err,req,res,next)=>{
    if(err.stack){
        console.log('global',err)
        return res.send({code:500,msg:err.message,type:'global'});
    }
    return next();
})
module.exports = app;


async function handle(req,res,next){
    try{
        let hasDone = false; //是否已经合并完成
        //后缀检测
        let suffix = req.body.filename.split('.');
        suffix = suffix.length >1 ? suffix.pop() : '';
        // let name = crypto.pseudoRandomBytes(16).toString('hex') + '.' + suffix;
        let name = req.body.guid + '.' + suffix;

        let dist = path.resolve($utils.UPLOAD_PATH,'tmp',name);
        if(!fs.existsSync(dist) && !hasDone){
            hasDone = true;

            let chunkList = fs.readdirSync(path.resolve($utils.UPLOAD_PATH,'tmp',req.body.guid));
            //检查分片是否都上传成功
            let chunk_path = path.resolve($utils.UPLOAD_PATH,'../',req.file.path,'../');
            
            await pipeChunk(dist,chunk_path,req.body.chunk_num,0);
            
            //复制文件到对应目录
            let save_path = await $utils.saveTmpFile({
                originalname:name,
                filename:req.body.guid,
                path:dist
            });
            console.log('after save')
            return res.send({code:0,msg:'上传成功',link:save_path})
        }else{
            return res.send({code:0,msg:'true'})
        }
    }catch(e){
        console.log('error handdle')
        return next(e);
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
                console.log('done')
                resolve(true);
                //所有文件都成功后，删除临时目录
                fs.rmdir(file_path, (e) => {
                    if (e) {
                        console.log(e);
                    }
                });
            }
        })
    })
    
}
