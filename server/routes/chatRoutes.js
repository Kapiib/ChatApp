const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const extractUserId = require("../utils/extractUserId");
const upload = require('../utils/multerConfig');

// Define chat routes
router.post('/create', extractUserId, chatController.create);
router.post('/find', extractUserId, chatController.find);
router.post('/createChat', extractUserId, chatController.createChat);
router.post('/userChats', extractUserId, chatController.userChats);

router.post("/channels/:channelId/photos", extractUserId, upload.single('photo'), chatController.uploadPhoto);


module.exports = router;