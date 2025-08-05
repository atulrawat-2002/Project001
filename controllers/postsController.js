


// Get All posts controller starts here
const getAllPostsController = async (req, res) => {
   try {
    // Request id return by the middleware
    console.log(req._id); 
     res.status(200).send("These are your all posts");
   } catch (error) {
    console.log(erorr)
   }
}



module.exports = {
    getAllPostsController,
} 