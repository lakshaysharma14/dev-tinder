const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Creating Schema
const userSchema = new Schema(
{
    firstName:{
        type: String,
        required: true,
        minLength: 4,
        maxLength: 30
    },
    lastName:{
        type: String,
        minLength: 4,
        maxLength: 30
    },
    emailId:{
        type: String,
        required: true,
        unique: true, // This Automatically Creates an Index in DB 
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email !!');
            }
        }
    },
    password:{
        type: String,
        required: true,
        minLength: 8,
        maxLength: 100
    },
    age:{
        type: Number,
        min: 18,
    },
    gender:{
        type: String,
        lowercase: true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Invalid Gender !!");
            }
        }
    },
    photoUrl:{
        type: String,
        default: "https://as1.ftcdn.net/v2/jpg/07/24/59/76/1000_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL !!");
            }
        }
    },
    about:{
        type: String,
        default: "This is a default bio !!",
        minLength: 5,
        maxLength: 100
    },
    skills: {
        type: [String],
    }
},
{
    timestamps: true,
}
);

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id},"Dev@Tinder#",{
        expiresIn:'15m'
    });
    return token;
}

userSchema.methods.validatePassword =  async function(enteredPw,hashedPw){
    return await bcrypt.compare(enteredPw,hashedPw);
}

// === Creating Model ===
const User = mongoose.model("User",userSchema); 

module.exports = User; 
