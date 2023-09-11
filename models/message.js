const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
    message : {
        type : String,
        required : true
    },
    sender : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'user',
        require : true
    },
    reciever : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : 'true'
    }
},{
    timestamps : true
})

const Message = mongoose.model('message',messageSchema,'message')
module.exports = Message;