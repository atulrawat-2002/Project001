const userRouter = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const userController = require("../controllers/userController");



userRouter.post("/follow", requireUser, userController.followUnFollowController);
userRouter.get("/getFeedData", requireUser, userController.getPostsOfFollowing);
userRouter.get("/getMyPosts", requireUser, userController.getMyPosts);
userRouter.get("/getUserPosts", requireUser, userController.getUserPosts);
userRouter.delete("/deleteMyProfile", requireUser, userController.deleteMyProfile);
userRouter.get("/getMyInfo", requireUser, userController.getMyInfo);
userRouter.put("/updateMyProfile", requireUser, userController.updateProfileController);
userRouter.post("/getUserProfile", requireUser, userController.getUserProfileController);

module.exports = userRouter; 