module.exports = {
    '/upload/upload':{
        method:'post',
        middleware:['upload.upload'],
        control:'upload.upload'
    },
    '/upload/chunk':{
        method:'post',
        middleware:['upload.chunk'],
        control:'upload.chunk'
    }
}