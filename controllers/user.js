const User = require('../models/user')

// get user

async function getUser(req,res){
    try{
        
    const username = req.params.id;
    const user = await User.findOne({username});
    if(!user) return res.json({error : "No user found"});

    // send back info about user
   
    const followersCount = user.followersCount;
    const followingsCount = user.followingsCount;
    
    const{name,avatar,coverImage,bio} = user;
    
    return res.json({name,username,avatar,coverImage,bio,followersCount,followingsCount});
    }
    catch(err){
        res.status(500).json(err);
    }
}

// send request
async function sendRequest(req,res){
    // id is the user to whom req is to be sent
    // req.user is the user sending request
    try{
    const username = req.params.id;
    const user = await User.findOne({username : username});
    if(!user) return res.status(400).json({error : "No user found"});
    user.request.push(req.username);
    await user.save();
    res.json({msg : "request sent"})
    }
    catch(err){
        res.status(500).json(err);
    }
}

async function togglePublic(req,res){
    try{
        const user = await User.findOne({username : req.username});
        if(!user) return res.status(400).json({error : "No user found"});
        user.public = !user.public;
        await user.save();
        res.json({msg : "account updated"})
    }
    catch(err){
        res.status(500).json(err);
    }
}


async function acceptRequest(req,res){
    try{
        const requestingUser = req.params.id; // user whose request is to be accepted
        const user = await User.findOne({username : req.username});
        // check if there is even a request from that user
        const reqUsr = user.request.find(u=>(u===requestingUser));
        if(!reqUsr) return res.status(400).json({error : "Invalid operation"})

        // update follower of user
        user.followers.push(requestingUser);
        user.followersCount++;
        await user.save();

        // update following of requesting user
        const rUser = await User.findOne({username : requestingUser});
        rUser.followings.push(req.username);
        rUser.followingsCount++;
        await rUser.save();
        res.json({msg : "added new follower"})
        


    }
    catch(err){
        res.status(500).json(err);
    }
}

module.exports = {acceptRequest,sendRequest,togglePublic,getUser};