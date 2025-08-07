const Post = require("../models/Post");
const User = require("../models/User");
const { success, error } = require("../utils/responseWrapper");




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
    createPostController,
    likeAndUnlikeController,
} 