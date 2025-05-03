const express = require('express');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');

const router = express.Router();

// Endpoint : /request/send/status/id
router.post("/send/:status/:toUserId",userAuth,async(req,res,next)=>{
    try{
        const fromUserId = req.user._id.toString();
        const {status,toUserId} = req.params;

        // Check-1 : For Valid Status 
        const allowedStatus = ['interested','ignored'];
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid Status Type:" + status);
        }

        // Check-2 : Check if there is existing connection req or not
        const existingConnectionReq = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}// if vice-versa also exist then it should not be allowed
            ]
        })
        if(existingConnectionReq){
            throw new Error("Connection Request Already Exist !!");
        }

        // Check-3 : If User Id to which we are sending Request exist or not in db
        const toUser = await User.findOne({_id:toUserId});
        if(!toUser){
            throw new Error("User Not Found !!");
        }

        // Check-4 : Cannot Send Reques to Itself(checked in pre-save condition)
        
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        
        const data = await connectionRequest.save();
        res.json({
            message:`Connection Req Handled Successfully`,
            data
        });

    }catch(error){
        res.status(400).send('Error: ' + error);
    }
});

// Endpoint : /request/review/status/id
router.post("/review/:status/:requestId",userAuth,async(req,res,next)=>{
    try{
        const loggedInUserId = req.user._id;
        const {status,requestId} = req.params;
        const allowedStatus = ["accepted","rejected"];

        // check 1 - status
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid Status Type:" + status);
        }
        // check 2 - finding req in db which we want to accept 
        const connectionReq = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUserId,
            status:"interested"
        });
        
        if(!connectionReq){
            throw new Error('Connection Request not Found');
        }

        connectionReq.status = status;
        const data = await connectionReq.save();
        
        res.json({
            message:'Connection Request processed Successfully: '+ data.status
        });
    }
    catch(error){
        res.status(404).send('Error: '+error.message);
    }
});

module.exports = router;