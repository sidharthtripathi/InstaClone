const User = require('../models/user')
const getFollowingStatus = require('../utils/getFollowingStatus')
// get user

async function getUser(req, res) {
    try {

        const username = req.params.id;
        const user = await User.findOne({ username });
        if (!user) return res.json({ error: "No user found" });

        // check following status
        const followingStatus = await getFollowingStatus(req.username,user);
        
        // send back info about user
        const followersCount = user.followersCount;
        const followingsCount = user.followingsCount;

        const { name, avatar, coverImage, bio } = user;

        return res.json({ name, username, avatar, coverImage, bio, followersCount, followingsCount, followingStatus });
    }
    catch (err) {
        res.status(500).json(err);
    }
}







async function togglePublic(req, res) {
    try {
        const user = await User.findOne({ username: req.username });
        if (!user) return res.status(400).json({ error: "No user found" });
        user.public = !user.public;
        await user.save();
        res.json({ msg: "account updated" })
    }
    catch (err) {
        res.status(500).json(err);
    }
}




module.exports = { togglePublic, getUser };