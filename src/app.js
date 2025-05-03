const express =  require('express');
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
 
const app = express();

// ==== Middlewares ==============
app.use(cors({
    origin:"http://localhost:5173", // Whitelisting domain name
    credentials: true
}));
// * If we dont pass any route it works for all routes
app.use(express.json()); // Middleware to parse json data which we are getting from server and convert it to js object
app.use(cookieParser()); // Middleware for parsing cookies

// ===== Router's ================
app.use('/auth',authRouter);
app.use('/profile',profileRouter);
app.use('/request',requestRouter);
app.use('/user',userRouter);

// ==== First Connect DB and then Start Listening to Server ====
connectDB().then(() => {
    console.log("Database Connected Successfully");
    app.listen(3000,()=>{
        console.log("Server is listening on 3000 port");
    });
}).catch((error)=> {
    console.log("Database cannot be Connected !!");
});
