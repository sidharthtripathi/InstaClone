const express = require('express')
const {verify} = require('../controllers/auth')
const userRouter = express.Router();
const {getUser,togglePublic,unfollow} = require('../controllers/user')


// get user 
userRouter.get('/:id',verify,getUser);
userRouter.put('/unfollow/:userId',verify,unfollow)

// verified user update themselves
// userRouter.put('/update',verify,updateUser);

// verified user deleting acccount
// userRouter.delete('/delete',verify,deleteUser);



// verified user toggle between public and private
userRouter.put('/toggle',verify,togglePublic);

module.exports = userRouter;