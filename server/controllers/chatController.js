const db = require("../db/dbConfig");

const chatController = {
    create: async (req, res) => {
        const userId = req.userId; // extracts the userId from JWT token
        const { name } = req.body; 
        
        try {
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
        const userId = req.userId; 
        const { recipientId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        try {
            const [users] = await db.query(
                "SELECT iduser, name FROM user WHERE iduser IN (?, ?)",
                [userId, recipientId]
            );

            if (users.length < 2) {
                return res.status(404).json({ error: "One or both users not found" });
            }

            const userName1 = users[0].name;
            const userName2 = users[1].name;

            const [existingChannel] = await db.query(
                "SELECT idchannels FROM channels WHERE (adminuser = ? AND name = ?) OR (adminuser = ? AND name = ?)",
                [userId, userName2, recipientId, userName1]
            );

            if (existingChannel.length > 0) {
                return res.status(200).json({ message: "Chat channel already exists", channelId: existingChannel[0].idchannels });
            }

            const [result] = await db.query(
                "INSERT INTO channels (name, adminuser) VALUES (?, ?)",
                [userName2, userId] 
            );

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
        const userId = req.userId

        if (!userId) {
            return res.status(400).json({message: "User ID is required"})
        }

        try {
            const [chats] = await db.query(`
                SELECT DISTINCT c.idchannels, c.name, c.adminuser, u.email, 
                       CASE 
                           WHEN c.adminuser = ? THEN (SELECT name FROM user WHERE iduser = uc.user_id AND uc.user_id != ?)
                           ELSE c.name
                       END AS chat_name
                FROM channels c
                JOIN user_channels uc ON c.idchannels = uc.channel_id
                JOIN user u ON u.iduser = uc.user_id
                WHERE uc.user_id = ? OR c.adminuser = ?
            `, [userId, userId, userId, userId]);
    
            if (chats.length === 0) {
                return res.status(404).json({ message: "No chats found for this user" });
            }
    
            res.status(200).json({ chats });
        } catch (error) {
            console.error("Error fetching user chats:", error);
            res.status(500).json({ error: "Internal server error" });
        }

    },
    uploadPhoto: async (req, res) => {
        const userId = req.userId;
        const channelId = req.params.channelId;
      
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }
      
        try {
          const [result] = await db.query(
            "INSERT INTO photos (channel_id, user_id, file_path) VALUES (?, ?, ?)",
            [channelId, userId, req.file.path]
          );
      
          res.status(201).json({
            message: "Photo uploaded successfully",
            photoId: result.insertId,
            filePath: req.file.path
          });
        } catch (error) {
          console.error("Error uploading photo:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      },
      sendMessage: async (req, res, io) => {
        const userId = req.userId; // Extract user ID from JWT
        const { content } = req.body;

        // Get current channelId from session
        const channelId = req.session.currentChannelId;

        if (!channelId) {
            return res.status(400).json({ error: "Channel ID is required" });
        }
    
        try {
            const [result] = await db.query(
                "INSERT INTO message (message, sendTime, user_id, channel_id) VALUES (?, ?, ?, ?)",
                [content, new Date(), userId, channelId]
            );
    
            const newMessage = {
                idMessage: result.insertId,
                message: content,
                sendTime: new Date(),
                user_id: userId,
                channel_id: channelId
            };
    
            // Emit the new message to all clients in the specified channel
            io.to(channelId).emit("receive_message", newMessage);
    
            res.status(201).json(newMessage);
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    getMessages: async (req, res) => {
        try {
            const [messages] = await db.query(
                "SELECT * FROM message ORDER BY sendTime ASC"
            );

            res.status(200).json({ messages });
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

  module.exports = chatController;