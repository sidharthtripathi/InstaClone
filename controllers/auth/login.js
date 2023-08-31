const jwt = require('jsonwebtoken')
const loginSchema = require('../../schema/login')
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const login = async (req,res)=>{
    try{
        const {error,value} = loginSchema.validate(req.body);
        if(error) return res.status(404).json(error);
        // check if username and password is correct
        const {username,password} = value;
        const user = await User.findOne({username});
        if(!user) return res.status(404).json({error : `No user with username ${username}`});
        // check password
        const result = await bcrypt.compare(password,user.password);
        if(!result) return res.status(404).json({error : "Wrong password"});
        
        // else create jwt token
        const jwtToken = jwt.sign({username,userId:user._id},process.env.JWT_KEY);
        res.send({'Auth-Token' : jwtToken});

    }
    catch(err){
        res.status(500).json(err);
    }
}

module.exports = login;