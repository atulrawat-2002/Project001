const jwt = require("jsonwebtoken");
const { error } = require("../utils/responseWrapper");
const User = require("../models/User");


const requireUser = async (req, res, next) => {

    // Checking for authorization token
    
    if (!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
        return res.send(error(409, "Authorization header is required!"))
    }

    // Extracting authorization token from request headers
    const accessToken = req.headers.authorization.split(" ")[1];
    

    try {
        // Verifing the access token and extracting the user id from token
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        req._id = decoded._id;
        const user = await User.findById(req._id);
        if( !user ) return res.send(error(404, "User not found!"));
        next();

    }
    catch (e) {
        console.log(" jwt expired");
        return res.send(error(401, "Invalid access key!"))
    }



}


module.exports = requireUser;