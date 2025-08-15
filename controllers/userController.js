const mongoose = require("mongoose")
/** @type {import('mongoose').Model} */
const Post = require("../models/Post");
const User = require("../models/User");
const { error, success } = require("../utils/responseWrapper");
const { mapPostsOutput } = require("../utils/util");
const cloudinary = require("cloudinary").v2;

const followUnFollowController = async (req, res) => {
    try {
        const curUserId = req._id;
        const { toUserId } = req.body;

        if (curUserId === toUserId) return res.send(error(401, "Can not follow Yourself!"));

        const toUser = await User.findById(toUserId);
        const curUser = await User.findById(curUserId);

        if (!toUser) return res.send(error(409, "User Not found!"));

        if (curUser.followings.includes(toUserId)) {
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

        const curUser = await User.findById(curUserId).populate('followings')

        const allPosts = await Post.find({
            owner: {
               $in: curUser.followings
            }
        })

        const followingsIds = await curUser.followings.map(item => item._id);

        const suggestions = await User.find({
            _id:{
                $nin : [...followingsIds, curUserId]
            }
        })

        const posts = allPosts.map(post => mapPostsOutput(post, curUserId)).reverse();

        return res.send(success(200, {curUser, posts, suggestions}))

    } catch (e) {
        res.send(error(500, e.message))
    }
}

const getMyPosts = async (req, res) => {

    try {
        const curUserId = req._id;

        const myAllPosts = await Post.find({
            owner: curUserId
        }).populate('likes')

        res.send(success(200, { myAllPosts }))
    } catch (e) {
        console.log(e);
        res.send(error(500, e.message))
    }
}

const getUserPosts = async (req, res) => {

    try {
        const userId = req.body.userId;

        if (!userId) return res.send(error(400, "User Id is required!"));

        const allPosts = await Post.find({
            owner: userId
        }).populate('likes')

        if (!allPosts) return res.send(error(404, "Posts not found!"));

        return res.send(success(200, { allPosts }));
    } catch (e) {
        res.send(error(500, e.message))
    }
}

const deleteMyProfile = async (req, res) => {
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId)

        //Step 1: deleting all the post of my self

        await Post.deleteMany({
            owner: curUserId
        });

        // Step 2: deleting myself from followers' followings
        for (const followerId of curUser.followers) {
            const follower = await User.findById(followerId);
            const index = follower.followings.indexOf(curUserId);
            if (index > -1) {
                follower.followings.splice(index, 1);
                await follower.save()
            }
        }

        //    Step 3 : deleting myself from the follwings's followers
        for (const followingId of curUser.followings) {
            const following = await User.findById(followingId);
            const index = following.followers.indexOf(curUserId);
            if (index > -1) {
                following.followers.splice(index, 1);
                await following.save()
            }
        }

        // Step 4 : deleting all the likes
        await Post.updateMany(
            { likes: curUserId },
            { $pull: { likes: curUserId } }
        );

        // Step 5: finally deleting the user
        await User.findByIdAndDelete(curUserId);

        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        })

        return res.send(success(200, "User deleted successfully"));

    } catch (e) {
        res.send(error(500, e.message))
    }
}


async function getMyInfo(req, res) {
    try {
        const user = await User.findById(req._id);

        return res.send(success(200, { user }));
    } catch (e) {
        res.send(error(500, e.message))
    }
}

const updateProfileController = async (req, res) => {
    try {
        const name = req.body?.name;
        const bio = req.body?.bio;
        const userImg = req.body?.userImg;
        const userId = req._id;
        if(!name || !bio || !userImg) return res.send(error(400, "Empty fields are not allowed"))
        const user = await User.findById(userId);
        user.name = name || user?.name;
        user.bio = bio || user?.bio;
        if(userImg) {
        const cloudImg = await cloudinary.uploader.upload(userImg);
        user.avatar = {
            url: cloudImg.url,
            publicId: cloudImg.public_id
        }
    }
        await user.save()

        return res.send(success(200, { user }));
    } catch (e) {
        res.send(error(500, e.message))
    }
}

const getUserProfileController = async (req, res) => {
    try {
        const userId = req.body?.userId;        

    const user = await User.findById(userId).populate({
        path: 'posts',
        populate: {
            path: 'owner'
        }
    }).populate([
        { path: 'followers', select: 'name avatar bio' },
        { path: 'followings', select: 'name avatar bio' }
    ])



    if( !user ) return res.send(error(404, "User not found!"));

    const allPost = user.posts;
    const posts = allPost.map(post => mapPostsOutput(post, req._id)).reverse();

    res.send(success(200, {user, posts}))
    } catch (e) {  
        console.log(e);
        
        res.send(error(500, e.message));
    }
}


module.exports = {
    followUnFollowController,
    getPostsOfFollowing,
    getMyPosts,
    getUserPosts,
    deleteMyProfile,
    getMyInfo,
    updateProfileController,
    getUserProfileController
}