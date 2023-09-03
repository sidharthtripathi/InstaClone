const express = require('express')
const {verify} = require('../controllers/auth')
const {getPost,updatePost,deletePost,createPost,likePost,getAllPosts} = require('../controllers/post')
const postRouter = express.Router();

// viewing post ( public or private func not added yet)
postRouter.get('/postid/:id',getPost);
postRouter.get('/all/:userid',verify,getAllPosts);

// creating post for verified user
postRouter.post('/create',verify,createPost);

// deleting post for verified user
postRouter.delete('/delete/:id',verify,deletePost);

// updating post for verified user
postRouter.put('/update/:id',verify,updatePost);

// liking a post for a verified user
postRouter.put('/like/:id',verify,likePost);

// user has to send number of likes in query params => from and to
// postRouter.get('/likes/:id',getLikes);

// // user has to send number of comments in query params => from and to
// postRouter.get('/comments/:id',getCommets);

module.exports = postRouter;
