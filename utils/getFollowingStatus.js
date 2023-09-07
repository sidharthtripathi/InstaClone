async function getFollowingStatus(requestingUserId,user){
    if(requestingUserId === user._id.toHexString()) return 'current';
    if(user.request.find(u=>u._id.toHexString()===requestingUserId)) return 'pending';
    if(user.followers.find(u=>u._id.toHexString()===requestingUserId)) return 'following';
    return 'none'
}

module.exports = getFollowingStatus;