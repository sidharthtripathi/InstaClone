const User = require('../models/user')
async function getRequestData(username){
    try{
    const user = await User.findOne({username});
    const requestArr = user.request;
    const data = [];
    for(let i = 0 ; i<requestArr.length ; i++){
        const obj = await User.findOne({username : requestArr[i]});
        data.push({avatar : obj.avatar, name : obj.name , username : obj.username})
    }
    return data;
    }
    catch(err){
        return err;
    }


}

module.exports = getRequestData;