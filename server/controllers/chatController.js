const db = require("../db/dbConfig");

const chatController = {
    create: async (req, res) => {
        const userId = req.userId; // extracts the userId from JWT token
        const { name } = req.body; 
        
        try {
            // Insert the new channel into the database with the provided name and the id to user who created it
            const [result] = await db.query(
                "INSERT INTO channels (name, adminuser) VALUES (?, ?)",
                [name, userId]
            );
            
            const channelId = result.insertId;
            
            res.status(201).json({ 
                message: "Channel created successfully", 
                channelId,
                adminUser: userId
            });
        } catch (error) {
            console.error("Error creating channel:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    find: async (req, res) => {
        const { username } = req.body;
        
        try {
            const [ user ] = await db.query(
                "SELECT name, email FROM user WHERE name LIKE ?",
                [ `%${username}%`]
            );

            if (user.length === 0) {
                return res.status(404).json ({ message: "No users found"});
            }

            res.status(200).json({ user });
        
        } catch (error) {
            console.error("Error finding the user:", error);
            res.status(500).json({ error: "Internal server error" })
        }
    },
    
    message: async (req, res) => {

        
    },

    directMessage: async (req, res) => {
        
    },

    userChats: async (req, res) => {
        
    }
};

  module.exports = chatController;