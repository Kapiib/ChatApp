const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const limiter = require("../utils/rateLimitConfig");

router.post("/login", limiter, authController.login);
router.post("/register", authController.register);
router.post("/delete", authController.delete);


module.exports = router;