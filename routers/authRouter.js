const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/signUp", authController.signUpController);
router.post("/login", authController.loginController);
router.get("/refresh", authController.refreshAccessTokenController)


module.exports = router;