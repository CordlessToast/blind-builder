const { Server } = require("socket.io");
const { rooms } = require("../services/roomService");
const registerRoomHandlers = require("./roomHandlers");
const registerGameHandlers = require("./gameHandlers");

const setupSockets = (server) => {
  const gameServer = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  gameServer.on("connection", (playerConnection) => {
    console.log("User connected:", playerConnection.id);

    const getPlayersInRoom = (roomId) => {
      const room = rooms[roomId];
      if (!room) return [];
      return room.players.map(p => p.username);
    };

    registerRoomHandlers(gameServer, playerConnection, getPlayersInRoom);
    registerGameHandlers(gameServer, playerConnection);
  });

  return gameServer;
};

module.exports = setupSockets;
