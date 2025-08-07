const userRouter = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const userController = require("../controllers/userController");



userRouter.post("/follow", requireUser, userController.followUnFollowController);
userRouter.get("/getPostsOfFollowing", requireUser, userController.getPostsOfFollowing);


module.exports = userRouter;