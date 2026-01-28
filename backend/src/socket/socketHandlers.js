let io;
const onlineUsers = new Map();

export const initializeSocket = (socketIO) => {
  io = socketIO;

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth?.userId;

    if (userId) {
      onlineUsers.set(userId.toString(), socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      console.log(`User ${userId} online`);
    }

    socket.on("disconnect", () => {
      if (userId) {
        onlineUsers.delete(userId.toString());
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
        console.log(`User ${userId} offline`);
      }
    });
  });
};

export const getReceiverSocketId = (userId) => {
  return onlineUsers.get(userId.toString());
};
