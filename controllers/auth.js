const loginSchema = require('../schema/login')
const User = require('../models/user');
const bcrypt = require('bcrypt');
const registerSchema = require('../schema/register');
const jwt = require('jsonwebtoken')
//login

const login = async (req,res)=>{
    try{
        const {error,value} = loginSchema.validate(req.body);
        if(error) return res.json({...error,error : error.details[0].message});
        // check if username and password is correct
        const {username,password} = value;
        const user = await User.findOne({username});
        if(!user) return res.json({error : `No user with username ${username}`});
        // check password
        const result = await bcrypt.compare(password,user.password);
        if(!result) return res.json({error : "Wrong password"});
        
        // else create jwt token
        const jwtToken = jwt.sign({username,userId:user._id},process.env.JWT_KEY);
        res.json({
            'Auth-Token' : jwtToken,
            username : user.username,
            name : user.name,
            avatar : user.avatar,
            userId : user._id,
            followersCount : user.followers.length,
            followingsCount : user.followings.length,
            bio : user.bio,
            email : user.email,
            coverImage : user.coverImage,
            public : user.public
        });

    }
    catch(err){
        res.status(500).json(err);
    }
}

// register

const register = async (req,res)=>{
    try{
        // validate req body
        const {error,value} = registerSchema.validate(req.body);
        if(error) return res.json({...error,error : error.details[0].message});
        // else proceed to create account
        // check if username taken
        
        const preUser = await User.findOne({username : value.username})
        if(preUser) return res.json({error : "user already exist"})
        // hash password before storing
        const hashedPass = await bcrypt.hash(value.password,10);
        const user = new User({...value,password : hashedPass});
        await user.save();
        res.json({msg : "user created"});
    }
    catch(err){
        res.status(500).json(err);
    }
}


// verification
const verify = (req,res,next)=>{
    try{
        const jwtToken = req.headers['auth-token'];
        if(!jwtToken) return res.json({error : "Provide Auth-Token in headers"});
        const verifiedToken = jwt.verify(jwtToken,process.env.JWT_KEY);
        // if fails falls into error
        req.username = verifiedToken.username;
        req.userId = verifiedToken.userId;
        next();
    }
    catch(err){
        console.log(err);
        res.json({error : "Invalid Token"});
    }
}


module.exports = {verify,login,register};