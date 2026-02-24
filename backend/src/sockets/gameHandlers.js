const { rooms, assignRoles } = require("../services/roomService");

module.exports = (gameServer, playerConnection) => {
    playerConnection.on("start_game", (roomId) => {
        const room = rooms[roomId];
        if (!room) return;

        room.game.status = "playing";
        console.log(`Room status:`, room.game.status);
        
        if (room.players.length === 2) {
            const roles = assignRoles(roomId);

            const frontendRoles = {};
            for (const socketId in roles) {
                const player = room.players.find(p => p.socketId === socketId);
                if (player) {
                    frontendRoles[player.username] = roles[socketId];
                }
            }

            gameServer.to(roomId).emit("game_starting", frontendRoles);
            console.log(`Game started in room ${roomId} with roles:`, frontendRoles);
        }
    });
};
