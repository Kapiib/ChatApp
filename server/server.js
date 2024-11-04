const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cors = require("cors")
const db = require("./db/dbConfig.js");
require("dotenv").config();

const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET, POST",
    credentials: true
}

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello")
})

app.post("/api/createUser", (req, res) => {
    const { name, email, password, repeatPassword } = req.body;

    if (password !== repeatPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ msg: "Error hashing password" });
        }

        const sqlQuery = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
        db.query(sqlQuery, [name, email, hashedPassword])
            .then(([rows]) => {
                if (rows.affectedRows === 1) {
                    res.status(200).json({ msg: "User created" });
                } else {
                    res.status(500).json({ msg: "User could not be created" });
                }
            })
            .catch((error) => {
                res.status(500).json({ msg: `Internal server error: ${error.message}` });
            });
    });
});

app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});