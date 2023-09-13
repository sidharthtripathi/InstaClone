const User = require('../models/user')
const getFollowingStatus = require('../utils/getFollowingStatus')
// get user

async function getUser(req, res) {
    try {

        const username = req.params.id;
        const user = await User.findOne({ username }).populate(["request","followers"])
        if (!user) return res.json({ success : false, error : "No such user! "});

        // check following status

        const followingStatus = await getFollowingStatus(req.userId,user);
        // send back info about user
        const followersCount = user.followers.length;
        const followingsCount = user.followings.length;

        const { name, avatar, coverImage, bio , _id } = user;

        return res.json({ _id,name, username, avatar, coverImage, bio, followersCount, followingsCount, followingStatus });
    }
    catch (err) {
        res.status(500).json(err);
    }
}







async function togglePublic(req, res) {
    try {
        const user = await User.findOne({ username: req.username });
        if (!user) return res.json({ success : false, error: "No user found" });
        user.public = !user.public;
        await user.save();
        res.json({ msg: "account updated" })
    }
    catch (err) {
        res.status(500).json(err);
    }
}


async function unfollow(req,res){
    try{
        const userId = req.params.userId;
        const user = User.findOne({username : req.username});
        const newfollowings = user.followings.filter(id=>(id !== userId))
        await user.save();
        res.json({success : true})
    }
    catch(err){
        res.json(err);
        console.log(err);
    }
}

module.exports = { togglePublic, getUser , unfollow };