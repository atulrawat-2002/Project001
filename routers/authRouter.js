const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/signUp", authController.signUpController);
router.post("/login", authController.loginController);


module.exports = router;