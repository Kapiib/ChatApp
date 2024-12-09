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
                "SELECT iduser, name, email FROM user WHERE name LIKE ?",
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
    
    createChat: async (req, res) => {
        const userId = req.userId; // Current user ID from JWT token
    const { recipientId } = req.body; // ID of the user to chat with

    // Check if userId is defined
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        // Fetch names of both users for naming the chat
        const [users] = await db.query(
            "SELECT iduser, name FROM user WHERE iduser IN (?, ?)",
            [userId, recipientId]
        );

        if (users.length < 2) {
            return res.status(404).json({ error: "One or both users not found" });
        }

        const userName1 = users[0].name; // Name of the current user
        const userName2 = users[1].name; // Name of the recipient

        // Check if a channel already exists for these two users
        const [existingChannel] = await db.query(
            "SELECT idchannels FROM channels WHERE (adminuser = ? AND name = ?) OR (adminuser = ? AND name = ?)",
            [userId, userName2, recipientId, userName1]
        );

        if (existingChannel.length > 0) {
            return res.status(200).json({ message: "Chat channel already exists", channelId: existingChannel[0].idchannels });
        }

        // Create a new chat channel with the recipient's name as the channel name
        const [result] = await db.query(
            "INSERT INTO channels (name, adminuser) VALUES (?, ?)",
            [userName2, userId] // Channel named after User 2 for User 1
        );

        // Insert both users into the user_channels table
        await db.query(
            "INSERT INTO user_channels (channel_id, user_id) VALUES (?, ?), (?, ?)",
            [result.insertId, userId, result.insertId, recipientId]
        );

        res.status(201).json({ 
            message: "Chat channel created successfully", 
            channelId: result.insertId 
        });

    } catch (error) {
        console.error("Error creating chat channel:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    },

    userChats: async (req, res) => {
        
    }
};

  module.exports = chatController;