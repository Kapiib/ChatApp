const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const db = require("./db/dbConfig.js");
require("dotenv").config();
const helmet = require ("helmet");

const corsOptions = require("./utils/corsConfig.js");
const limiter = require("./utils/rateLimitConfig.js");

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(corsOptions);
app.use(cookieParser());

// Content Security Police (CSP)
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"], // Allow content to be loaded only from the same origin
                scriptSrc: ["'self'",],
                styleSrc: ["'self'"],
                imgSrc: ["'self'"], 
                connectSrc: ["'self'"], 
                fonsSrc: ["'self'"],
                objectSrc: ["'none'"], // Disallow <object> tags to mitigate vulnerabilities like Flash

                // UpgradeInsecureRequests: [], automatically upgrade any HTTP requests to HTTPS (Is not using HTTPS thats why dont need it)
            }
        },
        crossOriginEmbedderPolicy: true, // Prevents sharing from untrusted sources using Cross-Origin Embedder Policy (COEP)
        xssFilter: true, // Prevents basic Cross-Site Scripting (XSS)
        frameguard: { action: "sameorigin" }, // Prevents clickjacking
        referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // Only use when involved in sensitive data or external requests
        hidePoweredBy: true // Hides the X-powered-by header for a tiny bit of security, it is often express

        // hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // Uncomment only in production with HTTPS
    })
);

const saltRounds = 10;

const JWT_SECRET = process.env.JWT_SECRET;

app.get("/", (req, res) => {
    res.send("Hello")
})




app.post("/api/register", (req, res) => {
    const { name, email, password, repeatPassword } = req.body;
    
    // Check if email is valid
    if (!validateEmail(email)) {
        return res.status(400).json({ msg: "Invalid email format" });
    }

    if (password === repeatPassword) {

        const checkEmailQuery = 'SELECT email FROM user WHERE email = ?';
        
        db.query(checkEmailQuery, [email])
            .then(([[existingUser]]) => {
                if (existingUser) {
                    return res.status(400).json({ msg: "Email already in use" });
                }

                // If email doesn't exist, proceed with registration
                bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
                    if (err) {
                        return res.status(500).json({ msg: `Error hashing password ${err}` });
                    }

                    const sqlQuery = 'insert into user(name, email, password, roles_idroles) values (?, ?, ?, (select idroles from roles where name = ?))';
                    
                    db.query(sqlQuery, [name, email, hashedPassword, "user"])
                        .then(([result]) => {
                            if (result.affectedRows === 1) {
                                res.status(200).json({ msg: "User created successfully" });
                            } else {
                                res.status(500).json({ msg: "User could not be created" });
                            }
                        })
                        .catch((error) => {
                            res.status(500).json({ msg: `Internal server error: ${error.message}` });
                        });
                });
            })
            .catch((error) => {
                res.status(500).json({ msg: `Error checking email: ${error.message}` });
            });
    } else {
        res.status(400).json({ msg: "Passwords do not match" });
    }
});

app.post("/api/login", limiter, (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ msg: "Please provide both email and password" });
    }

    // Query to get user data including password and role
    const sqlQuery = `
        SELECT user.*, roles.name as role_name 
        FROM user 
        JOIN roles ON user.roles_idroles = roles.idroles 
        WHERE email = ?
    `;

    db.query(sqlQuery, [email])
        .then(([[user]]) => {
            if (!user) {
                return res.status(401).json({ msg: "User does not exist" });
            }

            // Compare password with hashed password in database
            bcrypt.compare(password, user.password, function(err, result) {
                if (err) {
                    return res.status(500).json({ msg: "Error comparing passwords" });
                }

                if (!result) {
                    return res.status(401).json({ msg: "Invalid password" });
                }

                // Create JWT payload (Extra JWT insides)
                const payload = {
                    user_id: user.iduser,
                    email: user.email,
                    name: user.name,
                    role: user.role_name
                };

                // Sign JWT token (Merge)
                const token = jwt.sign(
                    payload,
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000
                });

                res.status(200).json({
                    msg: "Login successful",
                    user: {
                        id: user.iduser,
                        name: user.name,
                        email: user.email,
                        role: user.role_name,
                        token: token
                    }
                });
            });
        })
        .catch((error) => {
            console.error('Login error:', error);
            res.status(500).json({ msg: "Internal server error" });
        });
});

app.post("/api/chat", (req, res) => {
    const { message } = req.body;


})

app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});