const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const extractUserId = require("../utils/extractUserId")

// Define chat routes
router.post('/create', extractUserId, chatController.create);
router.post('/find', extractUserId, chatController.find);
router.post('/directMessage', extractUserId, chatController.directMessage);
router.post('/invite', extractUserId, chatController.userChats);


module.exports = router;