const express = require('express')
const verify = require('../controllers/auth/verify')
const {getPost,updatePost,deletePost,createPost} = require('../controllers/post')
const postRouter = express.Router();

// viewing post ( public or private func not added yet)
postRouter.get('/:id',getPost);

// creating post for verified user
postRouter.post('/create',verify,createPost);

// deleting post for verified user
postRouter.delete('/delete/:id',verify,deletePost);

// updating post for verified user
postRouter.put('/update/:id',verify,updatePost);



// user has to send number of likes in query params => from and to
// postRouter.get('/likes/:id',getLikes);

// // user has to send number of commnets in query params => from and to
// postRouter.get('/comments/:id',getCommets);

module.exports = postRouter;
