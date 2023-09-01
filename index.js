const express = require('express');
const dotenv = require('dotenv')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')

// setting up env variables
dotenv.config();
// setting up server and middlewares
const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// importing routes
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')

// setting up routes


app.use('/post',postRouter);
app.use('/user',userRouter);
app.use('/auth',authRouter);



// connecting to db and starting server
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('Database conneted...')
    const PORT = process.env.PORT || 3000;
    app.listen(PORT,()=>{
        console.log(`server listening on PORT:${PORT}`)
    })
})
.catch(err=>{
    console.log(err)
})