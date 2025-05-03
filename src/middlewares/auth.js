const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from cookies
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(401).send("Please Login");
    }
    // validate token
    const decodedToken = jwt.verify(token, "Dev@Tinder#");
    const { _id } = decodedToken;

    // Find the User
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("No User Found");
    }

    req.user = user;
    next(); // delegate the flow to request handler
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = {
  userAuth,
};
