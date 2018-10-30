module.exports = {
    //user
    '/user/':'user.index',
    '/user/logout':'user.logout',
    '/user/login':['post','user.login'],
    '/user/add':['post',['common.checkAuth'],'user.add'],
    
    //post
    '/post/':'post.index',
    '/post/create':['post',['common.checkAuth'],'post.create'],
    '/post/edit/:id':['post',['common.checkAuth'],'post.edit'],
    '/post/delete/:id':['post',['common.checkAuth'],'post.delete'],
    '/post/page(/:page)?':'post.page',
    
    //upload
    '/upload/upload':['post',['upload.upload','upload.fileCheck'],'upload.upload'],
    '/upload/chunk':['post',['upload.chunk'],'upload.chunk']
}