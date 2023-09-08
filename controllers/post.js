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
    if(!post) return res.json({error : "No such post exist"})
    // check if this post has been created by same user
    if(post.author!==req.userId) return res.json({error : "invalid operation"})
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
        if(error) return res.status.json(error)
        // check if post is there
        const post = await Post.findOne({_id:req.params.id});
        if(!post) return res.json({error : "no such post"});
        // check if the author is same as the user asking to update
        if(req.userId!=post.author) return res.json({error : "Invalid operation"});
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
        const post = await Post.findOne({_id: req.params.id}).select(["postData,postImages"])
        if(!post) return res.status(404).json({error : "no such post exist"})
        const author = await User.findOne({_id : post.author}).select["username", "avatar", "name"]
        const user = {
            username : author.username,
            name : author.name,
            avatar : author.avatar
        }
        res.json({user,postId:post._id,postData,postImages,likes:post.likes.length,comments : post.comments.length});
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
        if(!post) return res.status.json({error : "no such post"});
        // chance of duplicacy is here
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
    const user = await User.findOne({username : req.params.username}).select(["_id","avatar","username"])
    if(!user) return res.json({error : "No such user"})
    const allPost = await Post.find({author : user._id}).select(["postData","postImages","_id"]).sort({createdAt : -1})
    const data = {
        user : {
            avatar : user.avatar,
            username : user.username,
        },
        allPost
    }
    res.json(data)
    }
    catch(err){
        console.log(err)
        res.json(err);
    }
}

const getFeed = async (req,res)=>{
    try{
    // get all the peep he follows
    const user = await User.findOne({username : req.username}).select(["followings"])
    const posts = await Post.find({author : {$in:user.followings}}).populate({path : "author" , select : ["avatar","username"]}).select(["postData","postImages"]).sort({createdAt : -1})
    res.json(posts)
    }
    catch(err){
        res.json(err);
    }
}



module.exports = {getPost,updatePost,deletePost,createPost,likePost,getAllPosts , getFeed};