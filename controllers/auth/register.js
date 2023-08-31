const User = require('../../models/user')
const registerSchema = require('../../schema/register');
const bcrypt = require('bcrypt')
const register = async (req,res)=>{
    try{
        // validate req body
        const {error,value} = registerSchema.validate(req.body);
        if(error) return res.status(400).json(error);
        // else proceed to create account
        // check if username taken
        const preUser = User.findOne({username : value.username})
        if(preUser) return res.status(400).json({error : "user already exist"})
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

module.exports = register;