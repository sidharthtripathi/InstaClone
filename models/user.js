const mongoose =require('mongoose')

// user model
const userSchema = new mongoose.Schema({
    // basic info about user
    name : {
        type : String,
        required : true,
        minLength : 1,
        maxLenght : 50
    },
    password : {
        type : String,
        require: true,
        minLength : 8,
    },
    username : {
        type : String,
        required : true,
        minLength : 1,
        unique : true
    },
    email : {
        type : String,
        required : true,
    },
    avatar : String,
    coverImage : String,
    bio : {
        type : String,
        minLength : 1
    },
    public : {
        type : Boolean,
        default : true
    },
    // data related to his connections
    followers : {
        type : [mongoose.Schema.Types.ObjectId],
        ref :  "user"

    },
    followings : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'user'

    },
    request : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "user"
    },
    comment : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'comment'
    }

},{
    timestamps : true
})

const User = mongoose.model('user',userSchema,'user');
module.exports = User;