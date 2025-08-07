const Post = require("../models/Post");
const User = require("../models/User");
const { success, error } = require("../utils/responseWrapper");



// Get All posts controller starts here
const getAllPostsController = async (req, res) => {
    try {
        // Request id return by the middleware
        //  res.status(200).send("These are your all posts");
        return res.send(success(200, { message: "These are your all posta" }))
    } catch (error) {
        console.log(error)
    }
}

const createPostController = async (req, res) => {
    try { 
        const {caption} = req.body;
        const owner = req._id;

        const post = await Post.create({
            owner,
            caption
        })

        const user = await User.findById(req._id)

        user.posts.push(post._id);

        await user.save();

        return res.send(success(201, post))
    } catch (e) {
        return res.send(error(500, e.message))
    }

}

const likeAndUnlikeController = async (req, res) => {
try {
    const { postId } = req.body;
    const userId = req._id;

    const post = await Post.findById(postId);
    
    if( !post ) return res.send(error(404, "Post not found!")); 
    console.log(post.likes.includes(userId));
           

    if( post.likes.includes(userId) ) {
        const index = post.likes.indexOf(userId);
        post.likes.splice(index, 1);

        await post.save()

       return res.send(success(200, "Post Unliked!"));
    } else {
        
        post.likes.push(userId);     
        await post.save();   

       return res.send(success(200, "Post Liked"));
    }
} catch (e) {
    res.send(error(500, e.message));
    
}


}


module.exports = {
    getAllPostsController,
    createPostController,
    likeAndUnlikeController,
} 