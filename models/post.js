const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    postData : {
        type : String,
        required : true,
        minLength : 1
    },
    postImages : {
        type : [String]
    },
    likes : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'user'
    },
    comments : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'comment'
    }
    
},
{
    timestamps : true
})

const Post = mongoose.model('post',postSchema,'post');
module.exports = Post;