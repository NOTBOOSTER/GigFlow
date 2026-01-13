import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // Allow all for now
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => { 
    
    socket.on("join", (userId) => {
        socket.join(userId);
    });

    socket.on("disconnect", () => {
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
