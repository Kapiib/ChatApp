const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const limiter = require("../utils/rateLimitConfig.js");

router.post("/login", limiter, authController.login);
router.post("/register", authController.register);


module.exports = router;