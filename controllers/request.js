const User = require('../models/user');
async function acceptRequest(req, res) {
    try {
        const requestingUser = req.params.id; // user whose request is to be accepted
        // check if there is even a request from that user
        const user = await User.findOne({username: req.username}).populate('request');
        const reqUsr = user.request.find(u => (u.username === requestingUser));
        if (!reqUsr) return res.json({ error: "Invalid operation" })

        // update follower of user
        user.followers.push(reqUsr);
        // remove request
        const newReq = user.request.filter(u=>(u.username!==req.params.id));
        user.request = newReq;
        await user.save();

        // update following of requesting user
        const rUser = await User.findOne({ username: requestingUser });
        rUser.followings.push(req.userId);
        await rUser.save();
        res.json({ msg: "added new follower" })

    }
    catch (err) {
        res.status(500).json(err);
    }
}


async function deleteRequest(req,res){
    const user = req.params.id;
    // update the request array
    let primaryUser =  await User.findOne({username : req.username}).populate('request')
    let reqArr = primaryUser.request.filter(u=>(u.username!==user));
    primaryUser.request = reqArr;
    await primaryUser.save()
    res.send({msg : "request deleted"})
}

async function cancelRequest(req,res){
    const user = await User.findOne({username : req.params.id}).populate('request');
    if(!user) return res.json({error : "No such user"});

    // if request is there remove it, if not keep it same
    
    const reqArr = user.request.filter(u=>(u.username!==req.username))
    user.request = reqArr;
    await user.save();
    res.json({msg : "request pulled back"});
}

// send request
async function sendRequest(req, res) {
    // id is the user to whom req is to be sent
    // req.user is the user sending request
    try {
        const username = req.params.id;
        const user = await User.findOne({ username: username }).populate('request');
        if (!user) return res.json({ error: "No user found" });
        // check if req already send
        if(user.request.find(u=>u.username===req.username)) return res.json({error : "request already sent"})
        user.request.push(req.userId);
        await user.save();
        res.json({ msg: "request sent" })
    }
    catch (err) {
        res.json(err);
    }
}

async function getRequest(req,res){
    try{
    const username = req.username;
    const { request }= await User.findOne({username}).select(["request"]);
    const allUsers = await User.find({_id : {$in : request}}).select(["username", "name","avatar"]);
    res.json(allUsers)
    }
    catch(err){
        res.json(err);
    }
    
}


module.exports = {sendRequest,cancelRequest,acceptRequest,deleteRequest,getRequest}