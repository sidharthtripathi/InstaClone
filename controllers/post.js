const postSchema = require('../schema/post')
const Post = require('../models/post');
const User = require('../models/user')
// creating a post
const createPost = async (req,res)=>{
try{
    const {error,value} = postSchema.validate(req.body);
    if(error) return res.status(400).json(error)
    value.author = req.userId;
    const post = new Post(value);
    await post.save();
    res.json({msg : "post created"});
}
catch(err){
    res.status(500).json(err);
}
}

// deleting a post
const deletePost = async (req,res)=>{
try{
    const postId = req.params.id;
    // find post by id
    const post = await Post.findOne({_id : postId});
    if(!post) return res.status(400).json({error : "No such post exist"})
    // check if this post has been created by same user
    if(post.author!==req.userId) return res.status(400).json({error : "invalid operation"})
    await post.remove();
    res.json({msg : "post deleted"})
}
catch(err){
    res.status(500).json(err)
}
}

// updating a post
const updatePost = async(req,res)=>{
    try{
        const {error,value} = postSchema.validate(req.body);
        if(error) return res.status(400).json(error)
        // check if post is there
        const post = await Post.findOne({_id:req.params.id});
        if(!post) return res.status(400).json({error : "no such post"});
        // check if the author is same as the user asking to update
        if(req.userId!=post.author) return res.status(400).json({error : "Invalid operation"});
        post.postImages = value.postImages;
        post.postData = value.postData;
        await post.save();
        res.json({msg : "post updated"})
    }
    catch(err){
        res.status(500).json(err);
    }
}

// getting a post
const getPost = async (req,res)=>{
    try{
        const post = await Post.findOne({_id: req.params.id});
        if(!post) return res.status(404).json({error : "no such post exist"})
        const {postData,postImages} = post;
        const author = await User.findOne({_id : post.author}).username
        res.json({postData,postImages,author,likes:post.likes.length,comments : post.comments.length});
    }
    catch(err){
        res.status(500).json(err)
    }
}


module.exports = {getPost,updatePost,deletePost,createPost};