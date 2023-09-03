const express = require('express')
const requestRouter = express.Router();
const {acceptRequest,sendRequest,cancelRequest , deleteRequest , getRequest} = require('../controllers/request')
const {verify} = require('../controllers/auth')

// get all request
requestRouter.get('/',verify,getRequest);

// verified user send request
requestRouter.post('/:id',verify,sendRequest);

// verified user accept request
requestRouter.put('/accept/:id',verify,acceptRequest);

// cancel sent request
requestRouter.delete('/cancel/:id',verify,cancelRequest);

// delete request
requestRouter.delete('/delete/:id',verify,deleteRequest);

module.exports = requestRouter