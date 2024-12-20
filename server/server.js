const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const db = require("./db/dbConfig.js");
const cors = require("cors");
const session = require("express-session");
const multer = require("multer");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

// All the utilities
const corsOptions = require("./utils/corsConfig.js");
const limiter = require("./utils/rateLimitConfig.js");
const helmet = require("./utils/helmetConfig.js");
const extractUserId = require("./utils/extractUserId.js");
const upload = require("./utils/multerConfig.js");
const authRoutes = require("./routes/authRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const socketHandler = require("./utils/socketHandler.js");

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use(session({
    secret: 'aVerySecretSecretSecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // true if using HTTPS
}))

// Create an HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server);

socketHandler(io);

app.set('socketio', io);

// routes
app.use("/api/user", authRoutes);
app.use("/api/chat", chatRoutes);

// index
app.get("/", (req, res) => {
    res.redirect("http://localhost:3000");
});

server.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});