const Message = require('../models/message')
async function sendChats(req,res){
    try{
    const chatData = await Message.find({
        $or : [
            {sender : req.userId},
            {reciever : req.userId}
        ]
    }).populate({path : 'sender' , select : ["name","username","avatar"]})
    .populate({path : 'reciever' , select : ["name","username","avatar"]})
    .sort({createdAt : 1})
    res.json(chatData);
}
catch(err){
    res.json(err);
}
}

async function startChat(req,res){
    const newMsg = new Message({
        message : req.body.message,
        sender : req.userId,
        reciever : req.body.reciever
    })
    newMsg.save();
    res.json({success : true})
}
module.exports = {sendChats,startChat}