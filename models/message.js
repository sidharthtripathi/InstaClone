const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
    message : {
        type : String,
        required : true
    },
    sender : {
        type :  String,
        require : true
    },
    reciever : {
        type :  String,
        required : 'true'
    }
})

const Message = mongoose.model('message',messageSchema,'message')
module.exports = Message;