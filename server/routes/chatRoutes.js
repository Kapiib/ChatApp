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
router.post('/messages', extractUserId, (req, res) => {
    chatController.sendMessage(req, res, req.app.get('socketio')); // Get io from app
});
router.get('/messages/:channelId', extractUserId, chatController.getMessages);

router.post("/channels/:channelId/photos", extractUserId, upload.single('photo'), chatController.uploadPhoto);

router.post('/setCurrentChannel', extractUserId, (req, res) => {
    const { channelId } = req.body;

    if (!channelId) {
        return res.status(400).json({ error: "Channel ID is required" });
    }

    // Stores the current channel ID in the session
    req.session.currentChannelId = channelId; 

    res.status(200).json({ message: "Current channel updated", channelId });
});


module.exports = router;