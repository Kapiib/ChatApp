const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Define chat routes
router.post('/create', chatController.create);


module.exports = router;