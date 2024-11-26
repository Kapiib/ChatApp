const db = require("../db/dbConfig.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;

const saltRounds = 10;

const validateEmail = require("../utils/validateEmailConfig.js");

const authController = {
    login: async (req, res) => {
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
                    secure: process.env.NODE_ENV === 'production',
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
    },
    register: async (req, res) => {
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
    }
}

module.exports = authController;