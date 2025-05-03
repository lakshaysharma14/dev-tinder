const express = require('express');
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

// Endpoint : /user/request/received
router.get('/request/received',userAuth,async(req,res,next)=>{
    try{
        const loggedInUser = req.user;
        const data = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:'interested'
        }).populate("fromUserId","firstName lastName photoUrl about age");
        //populate("fromUserId",["firstName","lastName"]); // alternative syntax
        // either pass specific parameters in => [] or if we want complete then dont pass anything

        res.json({
            message:"data fetched",
            data
        })
    }catch(error){
        res.status(400),send({messahe:error.message});
    }
});

// Endpoint : /user/request/connections
router.get('/request/connections',userAuth,async(req,res,next)=>{
    try{
        const loggedInUser = req.user;
        const connectionReq = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id,status:'accepted'},
                {toUserId: loggedInUser._id,status:'accepted'}
            ],
            status:'accepted'
        }).populate("fromUserId","firstName lastName photoUrl about")
        .populate("toUserId","firstName lastName photoUrl about");
        
        const data = connectionReq.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }else{
                return row.fromUserId;
            }
        });

        res.json({
            message:"data fetched",
            data
        })
    }catch(error){
        res.status(400),send({messahe:error.message});
    }
});

router.get('/feed',userAuth,async  (req,res,next)=>{
    
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) ?? 1;
        let limit = parseInt(req.query.limit) ?? 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page-1)*limit;
        /*
            1. user should not see his own profile
            2. user should not see whom he has ignored or sent connection req
            3. user's connection
        */

        // Find All Connection Request to Whome I have sent connection req or received connection req
        const connectionReq = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId: loggedInUser._id}
            ],
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();

        connectionReq.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        })
        
        console.log("Users hidden in feed: ",hideUserFromFeed);

        // All User whom we want to hide along with the user itself
        const users = await User.find({
            $and: [
                {_id: { $nin: Array.from(hideUserFromFeed)}},
                {_id: {$ne : loggedInUser._id}}
            ]
        }).
        select("firstName lastName photoUrl about gender").
        skip(skip).
        limit(limit);

        
        res.json({
            message:'Feed Of User',
            data: users
        })

    }catch(error){
        res.status(400).send({messahe:error.message});
    }
});

module.exports = router;