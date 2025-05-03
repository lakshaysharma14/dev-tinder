const express = require('express');
const bcrypt = require('bcrypt');
const { validateSignUpData } = require('../utils/validations');
const User = require('../models/user');
const {userAuth} = require('../middlewares/auth');

const router = express.Router();

// Endpoint : /auth/signup
router.post("/signup",async (req,res,next)=>{
    try{
        // === validation of data ===
        validateSignUpData(req);
        const {firstName,lastName,emailId,password} = req.body;
        // === encrypt password ===
        const hashedPassword = await bcrypt.hash(password,10);
        // === save new user in db ===
        // creating new instance of User model
        const user = User({
            firstName,
            lastName,
            emailId,
            password:hashedPassword
        });
        // Always do interaction with db inside try and catch
        const savedUser = await user.save();
        const token = await savedUser.getJWT()
        console.log(token);
        res.cookie('token',token);
        res.json({message:`User Added Successfully`,data:savedUser});
    }catch(error){
        res.status(400).send("Error While Signing up the user : " + error.message);
    }
})
// Endpoint : /auth/login
router.post("/login",async(req,res,next)=>{
    try{
        const { emailId, password } = req.body;
        const user = await User.findOne({emailId:emailId});
        
        if(!user){
            throw new Error('Invalid Credentials');
        }
        
        const isValidPassword = await user.validatePassword(password,user.password);

        if(isValidPassword) {
            // Create a JWT Token
            const token = await user.getJWT()
            console.log(token);
            res.cookie('token',token);
            res.send(user);
        }else {
            throw new Error('Invalid Credentials');
        }
    }catch(error){  
        res.status(404).send('Login Failed: '+ error.message);
    }
});
// Endpoint : /auth/logout
router.post("/logout",async(req,res,next)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now())
    })
    res.send('User Logged Out Successfully');
})


module.exports = router;