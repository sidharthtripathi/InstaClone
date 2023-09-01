const express = require('express');
const dotenv = require('dotenv')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// setting up env variables
dotenv.config();
// setting up server and middlewares
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// importing routes
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')

// setting up routes
app.get('/',(req,res)=>{
    res.send('welcome to instagram...')
})

app.use('/post',postRouter);
app.use('/user',userRouter);
app.use('/auth',authRouter);


// connecting to db and starting server
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('Database conneted...')
    app.listen(process.env.PORT || 3000,()=>{
        console.log('server is up...')
    })
})
.catch(err=>{
    console.log(err)
})