const jwt = require("jsonwebtoken");


const requireUser = async (req, res, next) => {

    // Checking for authorization token
    if (!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
        return res.status(409).send("Unauthorized access!")
    }

    // Extracting authorization token from request headers
    const accessToken = req.headers.authorization.split(" ")[1];

    try {
        // Verifing the access token and extracting the user id from token
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        req._id = decoded._id;
        next();

    }
    catch (error) {
        console.log(error);
        return res.status(401).send("Unauthorized access!")
    }



}


module.exports = requireUser;