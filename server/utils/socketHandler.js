// socketHandler.js
const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("join_channel", (channelId) => {
            socket.join(channelId);
            console.log(`User joined channel: ${channelId}`);
        });

        socket.on("send_message", async (data) => {
            try {
                const { channelId, userId, message } = data;
                const [result] = await db.query(
                    "INSERT INTO messages (channel_id, user_id, content) VALUES (?, ?, ?)",
                    [channelId, userId, message]
                );

                const [userInfo] = await db.query(
                    "SELECT name FROM user WHERE iduser = ?",
                    [userId]
                );

                const messageData = {
                    id: result.insertId,
                    channelId,
                    userId,
                    userName: userInfo[0].name,
                    content: message,
                    timestamp: new Date()
                };

                // Emit to all clients in the channel
                io.to(channelId).emit("receive_message", messageData);
                console.log(`Message emitted to channel ${channelId}:`, messageData);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

module.exports = socketHandler;
