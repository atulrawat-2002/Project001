const postsRouter = require("express").Router();
const postController = require("../controllers/postsController");
const requireUser = require("../middlewares/requireUser");


postsRouter.post("/", requireUser, postController.createPostController);
postsRouter.post("/like", requireUser, postController.likeAndUnlikeController);
postsRouter.put("/update", requireUser, postController.postUpdateController);
postsRouter.delete("/delete", requireUser, postController.deletePostController);


module.exports = postsRouter;