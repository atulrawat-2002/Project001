const Post = require("../models/Post");
const User = require("../models/User");
const { error, success } = require("../utils/responseWrapper");


const followUnFollowController = async ( req, res ) => {
   try {
     const curUserId = req._id;
    const { toUserId } = req.body;

    if(curUserId === toUserId) return res.send(error(401, "Can not follow Yourself!"));

    const toUser = await User.findById(toUserId);
    const curUser = await User.findById(curUserId);

    if( !toUser ) return res.send(error(409, "User Not found!"));

    if(curUser.followings.includes(toUserId)){
        const followingIndex = curUser.followings.indexOf(toUserId);
        curUser.followings.splice(followingIndex, 1);

        const followerIndex = toUser.followers.indexOf(curUserId);
        toUser.followers.splice(followerIndex, 1);

        await curUser.save();
        await toUser.save();

        return res.send(success(200, "User Unfollowed!"));
    } else {
        curUser.followings.push(toUserId);
        toUser.followers.push(curUserId);

        await curUser.save();
        await toUser.save();

        return res.send(success(200, "User followed!"));
    } 

   } catch (e) {
        res.send(error(500, e.message))
   }

}


const getPostsOfFollowing = async (req, res) => {
   try {
     const curUserId = req._id;

    const curUser = await User.findById(curUserId);

    const posts = await Post.find({
        'owner': {
            '$in': curUser.followings
        }
    })

    return res.send(success(200, posts))

   } catch (e) {
        res.send(error(500, e.message))
   }
}


module.exports = {
    followUnFollowController,
    getPostsOfFollowing,
}