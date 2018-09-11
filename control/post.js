const Core = require('../core');
// const Model = require('../model/user');
class Control extends Core.Control {
    constructor(){
        super();
    }
    _route(){
        this.router.get('/',this.index) 
        this.router.post('/create',this.create) 
        this.router.get('/edit/:id',this.edit) 
        this.router.get('/delete/:id',this.delete) 
    }
    index(req, res, next){
        res.send('post index');
    }
    create(req, res, next){
        res.send(req.body);
    }
    edit(req,res,next){
        res.send('post edit')
    }
    delete(req,res,next){
        res.send(`pst delete ${req.params.id}`)
    }
}

module.exports = new Control().router;
