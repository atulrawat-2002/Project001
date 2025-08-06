const { success } = require("../utils/responseWrapper");



// Get All posts controller starts here
const getAllPostsController = async (req, res) => {
   try {
    // Request id return by the middleware
    console.log(req._id); 
    //  res.status(200).send("These are your all posts");
    return res.send(success(200, {message: "These are your all posta"}))
   } catch (error) {
    console.log(error)
   }
}



module.exports = {
    getAllPostsController,
} 