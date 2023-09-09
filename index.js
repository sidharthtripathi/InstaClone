const express = require('express');
const http = require('http')
const dotenv = require('dotenv')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const socket  = require('socket.io')
const jwt = require('jsonwebtoken')
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
        socket.join(socket.username);
        next();
    }
    catch(error){
        next(new Error(error));
    }
})

io.on('connection', (socket) => {
    // sending a personal message
    socket.on('personal-msg', async(data) => {
        if (!data.reciever) return;
        const msg = {
            msg: data.msg,
            sender: socket.username
        }
        const newMsg = new Message({
            sender : socket.username,
            reciever : data.reciever,
            message : data.msg
        })
        socket.to(data.reciever).emit('personal-msg', msg)
        await newMsg.save();
    })

    // deleting room of the leaving client
    socket.on('disconnect', () => {
        socket.leave(socket.name);
    })
})



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