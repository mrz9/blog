const Core = require('../core');
const multer  = require('multer');

let upload = multer({ dest: 'uploads/tmp' });
class Control extends Core.Control {
    constructor(){
        super();
    }
    /**
     * 控制器的路由写在这里
     */
    _route(){
        this.router.post('/upload',upload.single('file'),this.upload)
        this.router.post('/chunk',this.chunk)
    }
    async upload(){
        let dist = await this.$utils.saveTmpFile(this.req.file);
        this.res.send({code:0,msg:this.req.file,link:dist})
    }
    chunk(){

    }
}
module.exports = new Control().Router;