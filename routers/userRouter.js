const userRouter = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const userController = require("../controllers/userController");



userRouter.post("/follow", requireUser, userController.followUnFollowController);
userRouter.get("/getPostsOfFollowing", requireUser, userController.getPostsOfFollowing);
userRouter.get("/getMyPosts", requireUser, userController.getMyPosts);
userRouter.get("/getUserPosts", requireUser, userController.getUserPosts);
userRouter.delete("/deleteMyProfile", requireUser, userController.deleteMyProfile);


module.exports = userRouter;