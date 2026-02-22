const rooms = {};

function createRoom(roomId, socket, username) {
  rooms[roomId] = {
    players: [
      { socketId: socket.id, username }
    ],
    started: false,
    roles: {},
    gameState: {}
  };
}

function joinRoom(roomId, socket, username) {
  const room = rooms[roomId];
  if (!room || room.players.length >= 2) return false;

  room.players.push({ socketId: socket.id, username });
  return true;
}

function assignRoles(roomId) {
  const room = rooms[roomId];
  const [p1, p2] = room.players;

  const isFirstGuide = Math.random() < 0.5;

  room.roles = {
    [p1.socketId]: isFirstGuide ? "Guide" : "Builder",
    [p2.socketId]: isFirstGuide ? "Builder" : "Guide"
  };

  room.started = true;
  return room.roles;
}

function removePlayer(socketId) {
  for (const roomId in rooms) {
    const room = rooms[roomId];
    room.players = room.players.filter(p => p.socketId !== socketId);
    if (room.players.length === 0) delete rooms[roomId];
  }
}

module.exports = {
  rooms,
  createRoom,
  joinRoom,
  assignRoles,
  removePlayer
};