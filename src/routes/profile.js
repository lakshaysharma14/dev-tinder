const express = require('express');
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData} = require('../utils/validations');

const router = express.Router();

// Endpoint : /profile/view
router.get("/view",userAuth,async(req,res,next)=>{
    try{
        const user  = req.user;
        res.send(user);
    }catch(error){
        res.status(404).send("Please Try to Login Again to Access the Resource: " + error);
    }
});

// Endpoint : /profile/edit
router.patch("/edit",userAuth,async(req,res,next)=>{
    try{
        if(!validateProfileEditData(req)){
            throw new Error('Invalid Edit Request');
        }
        
        const loggedInUser = req.user;
        console.log("Logged In User Before Update:", JSON.stringify(loggedInUser,null,4));

        Object.keys(req.body).every((key) => (loggedInUser[key] = req.body[key]))

        console.log("Logged In User After Update:", JSON.stringify(loggedInUser,null,4));

        await loggedInUser.save();

        res.json({message:"user details updated successfully","user":loggedInUser});


    }catch(error){
        res.status(400).send("User Data Cannot be Modified: " + error);
    }
})

module.exports = router;