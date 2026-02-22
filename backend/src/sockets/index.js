const { Server } = require("socket.io");
const { rooms, createRoom, joinRoom, assignRoles, removePlayer } = require("../servicees/roomService");

const setupSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const getPlayersInRoom = (roomId) => {
      const room = rooms[roomId];
      if (!room) return [];
      return room.players.map(p => p.username);
    };

    socket.on("create_room", (username) => {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      socket.join(roomId);
      socket.username = username; 
      socket.roomId = roomId;    
      
      createRoom(roomId, socket, username);
      
      socket.emit("room_created", roomId);
      
      io.to(roomId).emit("update_players", getPlayersInRoom(roomId));
      
      console.log(`User ${username} created room ${roomId}`);
    });

    socket.on("join_room", ({ username, roomId }) => {
      const success = joinRoom(roomId, socket, username);
      
      if (success) {
        socket.join(roomId);
        socket.username = username; 
        socket.roomId = roomId;     
        
        socket.emit("room_joined", roomId);
        
        io.to(roomId).emit("update_players", getPlayersInRoom(roomId));
        
        console.log(`User ${username} joined room ${roomId}`);
      } else {
        const room = rooms[roomId];
        if (!room) {
          socket.emit("error", "Room not found");
        } else if (room.players.length >= 2) {
          socket.emit("error", "Room is full");
        } else {
          socket.emit("error", "Failed to join room");
        }
      }
    });

    socket.on("start_game", (roomId) => {
      const room = rooms[roomId];
      if (room && room.players.length === 2) {
        const roles = assignRoles(roomId);
        
        // Map socketId to username for the frontend
        const frontendRoles = {};
        for (const socketId in roles) {
          const player = room.players.find(p => p.socketId === socketId);
          if (player) {
            frontendRoles[player.username] = roles[socketId];
          }
        }
        
        io.to(roomId).emit("game_starting", frontendRoles);
        console.log(`Game started in room ${roomId} with roles:`, frontendRoles);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      
      const roomId = socket.roomId;
      removePlayer(socket.id);
      
      if (roomId) {
        io.to(roomId).emit("update_players", getPlayersInRoom(roomId));
      }
    });
  });

  return io;
};

module.exports = setupSockets;
