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
                    name: user.name,
                    email: user.email,
                    role: user.role_idroles
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
},
    delete: async (req, res) => {
        const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ msg: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verify and decode the token
        const userId = decoded.user_id; // Extracting user_id from the decoded payload

        // Step 1: Find all channels where this user is a participant
        const [userChannels] = await db.query(
            "SELECT channel_id FROM user_channels WHERE user_id = ?",
            [userId]
        );

        // Step 2: Delete from user_channels first
        await db.query("DELETE FROM user_channels WHERE user_id = ?", [userId]);

        // Step 3: Optionally delete channels if there are no other users
        for (const channel of userChannels) {
            const channelId = channel.channel_id;

            // Check how many users are in this channel
            const [userCount] = await db.query(
                "SELECT COUNT(*) as count FROM user_channels WHERE channel_id = ?",
                [channelId]
            );

            if (userCount[0].count === 0) { // Only delete if there are no remaining users
                await db.query("DELETE FROM channels WHERE idchannels = ?", [channelId]);
            }
        }

        // Step 4: Finally, delete the user from the database
        await db.query("DELETE FROM user WHERE iduser = ?", [userId]);

        res.status(200).json({ msg: "User deleted successfully" });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
}
}

module.exports = authController;