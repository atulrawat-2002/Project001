const postsRouter = require("express").Router();
const postController = require("../controllers/postsController");
const requireUser = require("../middlewares/requireUser");


// Using middleware for checking authorization
postsRouter.get("/all", requireUser, postController.getAllPostsController);
postsRouter.post("/", requireUser, postController.createPostController);
postsRouter.post("/like", requireUser, postController.likeAndUnlikeController);


module.exports = postsRouter;