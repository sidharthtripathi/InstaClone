async function getFollowingStatus(requestingUser,user){
    if(requestingUser === user.username) return 'current';
    if(user.request.find(u=>u===requestingUser)) return 'pending';
    if(user.followers.find(u=>u===requestingUser)) return 'following';
    return 'none'
}

module.exports = getFollowingStatus;