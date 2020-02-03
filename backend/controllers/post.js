const Post = require('../models/post');

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath:url + '/images/' + req.file.filename,
        creator:req.userData.userId
    });
    post.save().then((createdPost)=>{
        res.status(201).send({
            message: 'Post added successfully',
            post:{
                ...createdPost,
                id: createdPost._id,
            }
        })
    })
  
}

exports.updatePost = (req,res,next)=> {
    let imagePath = req.body.imagePath;
   if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
   }
    const post = new Post({
        _id:req.body.id,
        title: req.body.title,
        content:req.body.content,
        imagePath:imagePath,
        creator:req.userData.userId
    })
    Post.updateOne({_id:req.params.id,creator:req.userData.userId},post)
    .then((result)=>{
        if(result.n>0) {
            res.status(200).json({message:'updated successfully'});
        } else {
            res.status(401).json({message:'not authorized'})
        }
    })
}

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    let fetchedPost;
    const postQuery = Post.find()
    if(pageSize && currentPage) {
        postQuery
        .skip(pageSize*(currentPage-1))
        .limit(pageSize);
    }
   
    postQuery.then((doc)=>{
        fetchedPost = doc;
        return Post.count()
   })
   .then((count)=>{
    res.json({
        message: 'posts fetched successfully!',
        posts: fetchedPost,
        maxPosts: count
    });
   })
}

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id)
    .then((post)=>{
        if(post) {
         res.status(200).json(post);
        } else {
            res.status(404).json({message:'Post not found'})
        }
    })
  }

  exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id:req.params.id,creator:req.userData.userId})
    .then((result)=>{
        if(result.n>0) {
            res.status(200).json({message:'deletion successfully'});
        } else {
            res.status(401).json({message:'not authorized'})
        }
    })
 }