const express = require('express')
const {verify} = require('../controllers/auth')
const userRouter = express.Router();
const {acceptRequest,sendRequest,togglePublic,getUser} = require('../controllers/user')


// get user 
userRouter.get('/:id',verify,getUser);

// verified user update themselves
// userRouter.put('/update',verify,updateUser);

// verified user deleting acccount
// userRouter.delete('/delete',verify,deleteUser);

// verified user send request
userRouter.post('/request/:id',verify,sendRequest);

// verified user accept request
userRouter.put('/accept/:id',verify,acceptRequest);

// verified user toggle between public and private
userRouter.put('/toggle',verify,togglePublic);

module.exports = userRouter;