const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema({
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'post',
        required : true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    comment : {
        type : String,
        required : true
    }

},
{
    timestamps : true
})

const Comment = mongoose.model('comment',commentSchema,'comment')