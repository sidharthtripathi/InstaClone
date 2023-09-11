const express = require('express');
const http = require('http')
const dotenv = require('dotenv')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const socket  = require('socket.io')
const jwt = require('jsonwebtoken')
const {verify} = require('./controllers/auth')
const {sendChats,startChat} = require('./controllers/chat.js')
const Message = require('./models/message')
// setting up env variables
dotenv.config();
// setting up server and middlewares
const app = express();
const server = http.createServer(app);
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// importing routes
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')
const requestRouter = require('./routes/request')

// setting up routes


app.use('/post',postRouter);
app.use('/user',userRouter);
app.use('/auth',authRouter);
app.use('/request',requestRouter)
app.get('/chats',verify,sendChats)
app.post('/chat/start',verify,startChat)


// socket 
const io = socket(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})

// verification before connection
io.use((socket, next) => {
    try {
        const authToken = socket.handshake.query.token;
        if (!authToken) return next(new Error("Missing token"))
        const verified = jwt.verify(authToken,process.env.JWT_KEY)
        socket.username = verified.username;
        socket.userId = verified.userId;
        socket.join(socket.userId);
        next();
    }
    catch(error){
        next(new Error(error));
    }
})

io.on('connection', (socket) => {
    // sending a personal message
    socket.on('personal-msg', async(data) => {
        if (!data.to.userId) return;
        const msg = {
            message: data.message,
            from : {
                userId : socket.userId,
                username  : socket.username,
                avatar : data.from.avatar
            },
            to : {
                userId : data.to.userId
            }
            
        }
        const newMsg = new Message({
            sender : socket.userId,
            reciever : data.to.userId,
            message : data.message
        })
        socket.to(data.to.userId).emit('personal-msg', msg)
        try{await newMsg.save();}
        catch(err){console.log(err)}
    })

    // deleting room of the leaving client
    socket.on('disconnect', () => {
        socket.leave(socket.name);
    })
}
)



// connecting to db and starting server
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('Database conneted...')
    const PORT = process.env.PORT || 3000;
    server.listen(PORT,()=>{
        console.log(`server listening on PORT:${PORT}`)
    })
})
.catch(err=>{
    console.log(err)
})