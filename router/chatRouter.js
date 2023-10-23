const express = require("express");
const router = express.Router();

const chatController = require("../controller/chatController");
const Authentication = require("../middleware/auth");

router.post("/sendMessage", Authentication, chatController.sendMessage);
// router.get("/getMessages", chatController.getMessages);

module.exports = router;