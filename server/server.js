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
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.use(cookieParser());

const saltRounds = 10;

const JWT_SECRET = process.env.JWT_SECRET;

app.get("/", (req, res) => {
    res.send("Hello")
})


app.post("/api/register", (req, res) => {
    const { name, email, password, repeatPassword } = req.body;
    console.log(req.body);
    if (password === repeatPassword) {

        bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
            console.log(password);
            console.log(saltRounds);
            if (err) {
                return res.status(500).json({ msg: `Error hashing password ${err}` });
            }

            const sqlQuery = 'insert into user(name, email, password, roles_idroles) values (?, ?, ?, (select idroles from roles where name = ?))';
            
            db.query(sqlQuery, [name, email, hashedPassword, "user"])
                .then(([result]) => {
                    if (result.affectedRows === 1) {
                        res.status(200).json({ msg: "User created" });
                    } else {
                        res.status(500).json({ msg: "User could not be created" });
                    }
                })
                .catch((error) => {
                    res.status(500).json({ msg: `Internal server error: ${error.message}` });
                });
        });

    } else {
        res.status(400).json({ msg: "Passwords do not match" });
    }
});

app.post("/api/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    // Email and password check
    if (email === undefined || password === undefined) {
      res.status(400).json({ msg: 'Email and password are required' });
      return;
    }
  
    // Checks email in databse
    db.execute('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
      if (err) {
        res.status(500).json({ message: 'Database error', error: err });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      const user = results[0];
  
      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (isMatch === false) {
        res.status(401).json({ message: 'Incorrect password' });
        return;
      }
  
      // Create JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ msg: 'Login successful', token });
    });
  });

app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});