const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const db = require("./db/dbConfig.js");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

// All the utilities
const corsOptions = require("./utils/corsConfig.js");
const limiter = require("./utils/rateLimitConfig.js");
const helmet = require("./utils/helmetConfig.js");
const extractUserId = require("./utils/extractUserId.js");
const upload = require("./utils/multerConfig.js");
const authRoutes = require("./routes/authRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// routes
app.use("/api/user", authRoutes);
app.use("/api/chat", chatRoutes);

// index
app.get("/", (req, res) => {
    res.redirect("http://localhost:3000");
});

app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});