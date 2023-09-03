const postSchema = require('../schema/post')
const Post = require('../models/post');
const User = require('../models/user')
// creating a post
const createPost = async (req,res)=>{
try{
    const {error,value} = postSchema.validate(req.body);
    if(error) return res.json(error)
    value.author = req.userId;
    const post = new Post(value);
    await post.save();
    res.json(post);
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
        res.json({postId:post._id,postData,postImages,author,likes:post.likes.length,comments : post.comments.length});
    }
    catch(err){
        res.status(500).json(err)
    }
}

// liking a post
const likePost = async (req,res)=>{
    try{
        // get the post
        const post = await Post.findOne({_id : req.params.id});
        if(!post) return res.status(404).json({error : "no such post"});
        const likedUsers = [...post.likes,req.userId];
        post.set({likes : likedUsers});
        await post.save();
        res.json({success : true});
    }
    catch(err){
        res.status(500).json(err);
    }
}

async function getAllPosts(req,res){
    try{
    const user = await User.findOne({username : req.params.userid})
    const allPost = await Post.find({author : user._id})
    res.json(allPost)
    }
    catch(err){
        console.log(err)
        res.json(err);
    }
}



module.exports = {getPost,updatePost,deletePost,createPost,likePost,getAllPosts};