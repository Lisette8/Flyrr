import { Server } from "socket.io";

let io;
const onlineUsers = new Map(); // userId -> socketId

export const initializeSocket = (socketIO) => {
    io = socketIO;

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // User comes online
        socket.on("userOnline", (userId) => {
            if (userId) {
                onlineUsers.set(userId, socket.id);
                io.emit("onlineUsers", Array.from(onlineUsers.keys()));
                console.log(`User ${userId} is online`);
            }
        });

        socket.on("disconnect", () => {
            // Remove user from online users
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
                    console.log(`User ${userId} went offline`);
                    break;
                }
            }
            console.log("User disconnected:", socket.id);
        });
    });
};

export const getIO = () => {
    if (!io) {
        // throw new Error("Socket.IO not initialized");
        console.warn("Socket.IO not initialized!")
        return null
    }
    return io;
};

export const getReceiverSocketId = (userId) => {
    return onlineUsers.get(userId.toString());
};

export const getOnlineUsers = () => {
    return Array.from(onlineUsers.keys());
};
