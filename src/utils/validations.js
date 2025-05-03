const validator = require('validator');

const validateSignUpData = (req) => {
    const {
        firstName,
        lastName,
        emailId,
        password
    } = req.body;

    if(!firstName || !lastName){
        throw new Error("InValid Name");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email Id");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not Strong");
    }
}

const validateProfileEditData = (req) => {
    const allowedEditFields = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];

    const isEditAllowed = Object.keys(req.body).every((key)=>{
        return allowedEditFields.includes(key);
    })

    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateProfileEditData
}