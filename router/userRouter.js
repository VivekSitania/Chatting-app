const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

const auth = require("../middleware/auth");
const secure = require("../middleware/secure");

router.get("/", secure, userController.getLoginPage);

router.post("/signUp", secure, userController.postUserSignUp);

router.post("/login", secure, userController.postUserLogin);

router.get("/homePage", auth, userController.getHomePage);

module.exports = router;