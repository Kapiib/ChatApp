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

        try {
            const [[user]] = await db.query(sqlQuery, [email]); // Use await here
            if (!user) {
                return res.status(401).json({ msg: "User does not exist" });
            }

            // Compare password with hashed password in database
            const isPasswordValid = await bcrypt.compare(password, user.password); // Use await here
            if (!isPasswordValid) {
                return res.status(401).json({ msg: "Invalid password" });
            }

            // Create JWT payload
            const payload = {
                user_id: user.iduser,
                name: user.name,
                email: user.email,
                role: user.role_idroles
            };

            // Sign JWT token
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

            // Update lastLoggedIn timestamp
            const updateQuery = `UPDATE user SET lastLoggedIn = NOW() WHERE iduser = ?`;
            await db.query(updateQuery, [user.iduser]); // Use await here

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
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ msg: "Internal server error" });
        }
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
        const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verify and decode the token
        const userId = decoded.user_id; // Extracting user_id from the decoded payload

        //Finds all channels where this user is a participant
        const [userChannels] = await db.query(
            "SELECT channel_id FROM user_channels WHERE user_id = ?",
            [userId]
        );

        //Deletes from user_channels first
        await db.query("DELETE FROM user_channels WHERE user_id = ?", [userId]);

        //Optionally delete channels if there are no other users
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

        //Finally, delete the user from the database (Too much work)
        await db.query("DELETE FROM user WHERE iduser = ?", [userId]);

        res.status(200).json({ msg: "User deleted successfully" });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
}
}

module.exports = authController;