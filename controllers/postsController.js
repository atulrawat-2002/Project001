const Post = require("../models/Post");
const User = require("../models/User");
const { success, error } = require("../utils/responseWrapper");




const createPostController = async (req, res) => {
    try {
        const { caption } = req.body;
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

        if (!post) return res.send(error(404, "Post not found!"));

        if (post.likes.includes(userId)) {
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

const postUpdateController = async (req, res) => {
    try {
        const { postId, caption } = req.body;
        const curUserId = req._id;

        const post = await Post.findById(postId);

        if(post.owner != curUserId) return res.send(error(409, "Can not update this post!"));

        if(!post) return res.send(error(404, "Post not found!"));

        if(caption) post.caption = caption;

        await post.save();

        return res.send(success(200, post))

    } catch (e) {
        res.send(error(500, e.message));
        
    }
}

const deletePostController = async (req, res) => {
    try {
        
        const { postId } = req.body;
    const curUserId = req._id;

    if( !postId ) return res.send(error(409, "Post id is required!"));

    const post = await Post.findById(postId);
    const curUser = await User.findById(curUserId);

    if(post.owner != curUserId) return res.send(error(409, "Can not delete this post!"));

    if(!post) return res.send(error(404, "Post not found!"));

    const index = curUser.posts.indexOf(postId);
    curUser.posts.splice(index, 1);

    await curUser.save();

    await Post.findByIdAndDelete(postId);

    return res.send(success(200, "Posts deleted successfully!"))
    } catch (e) {        
        res.send(error(500, e.message))
    }

}


module.exports = { 
    createPostController,
    likeAndUnlikeController,
    postUpdateController,
    deletePostController
} 