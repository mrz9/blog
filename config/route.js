module.exports = {
    //user
    '/user/':'user.index',
    '/user/logout':'user.logout',
    '/user/login':['post','user.login'],
    '/user/add':['post',['common.checkAuth'],'user.add'],
    
    //post
    '/post/':'post.index',
    '/post/create':['post','post.create'],
    '/post/edit/:id':['post','post.edit'],
    '/post/delete/:id':'post.delete',
    '/post/page(/:page)?':'post.page',
    
    //upload
    '/upload/upload':['post',['upload.fileCheck'],'upload.upload'],
    '/upload/chunk':['post',['upload.chunk','upload.fileCheck'],'upload.chunk']
}