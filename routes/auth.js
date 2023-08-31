const express = require('express')
const login = require('../controllers/auth/login');
const register = require('../controllers/auth/register')
const authRouter = express.Router();

authRouter.post('/login',login);
authRouter.post('/register',register);

module.exports = authRouter;