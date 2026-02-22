const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Helper function to get all players in a room
  const getPlayersInRoom = (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) return [];
    
    const players = [];
    for (const socketId of room) {
      const clientSocket = io.sockets.sockets.get(socketId);
      if (clientSocket && clientSocket.username) {
        players.push(clientSocket.username);
      }
    }
    return players;
  };

  socket.on("create_room", (username) => {
    const roomId = Math.random().toString(36).substring(7);
    socket.join(roomId);
    socket.username = username; // Store username on socket
    socket.roomId = roomId;     // Store roomId on socket
    
    socket.emit("room_created", roomId);
    
    // Send updated player list to the room
    io.to(roomId).emit("update_players", getPlayersInRoom(roomId));
    
    console.log(`User ${username} created room ${roomId}`);
  });

  socket.on("join_room", ({ username, roomId }) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room) {
      if (room.size >= 2) {
        socket.emit("error", "Room is full");
        return;
      }
      
      socket.join(roomId);
      socket.username = username; // Store username on socket
      socket.roomId = roomId;     // Store roomId on socket
      
      socket.emit("room_joined", roomId);
      
      // Send updated player list to everyone in the room
      io.to(roomId).emit("update_players", getPlayersInRoom(roomId));
      
      console.log(`User ${username} joined room ${roomId}`);
    } else {
      socket.emit("error", "Room not found");
    }
  });

  socket.on("start_game", (roomId) => {
    const players = getPlayersInRoom(roomId);
    if (players.length === 2) {
      // Randomly assign roles
      const isFirstGuide = Math.random() < 0.5;
      const roles = {
        [players[0]]: isFirstGuide ? "Guide" : "Builder",
        [players[1]]: isFirstGuide ? "Builder" : "Guide"
      };
      
      io.to(roomId).emit("game_starting", roles);
      console.log(`Game started in room ${roomId} with roles:`, roles);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    
    // If the user was in a room, update the player list for remaining users
    if (socket.roomId) {
      io.to(socket.roomId).emit("update_players", getPlayersInRoom(socket.roomId));
    }
  });
});

app.get("/", (req, res) => {
  res.send("Blind Builder backend running!");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
