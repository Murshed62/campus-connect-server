const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

// web socket connection
io.on("connection", (socket) => {
  socket.on("start-conversation", ({ conversationId }) => {
    socket.join(conversationId);
  });
  socket.on("message", ({ conversationId, message }) => {
    socket.to(conversationId).emit({ message });
  });
  socket.on("end-conversation", ({ conversationId }) => {
    socket.leave(conversationId);
  });
});

module.exports = {
  io,
  server,
};
