module.exports = {
    debug:true,
    db: {
        type:'mysql',
        host:'localhost',
        user:'root',
        password:'root',
        prefix:'',
        database:'blog'
    },
    upload:{
        max_size:2 * 1024 * 1024,    // 允许上传文件大小的最大值（单位 Bytes），设置为 0 表示无限制
        allowed_types:'jpg|gif|png|bmp|webp|mp4|zip|rar|gz|bz2|xls|xlsx|pdf|doc|docx'  //允许上传的后缀名集合
    }
}