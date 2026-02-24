const { rooms, createRoom, joinRoom, removePlayer } = require("../services/roomService");

module.exports = (gameServer, playerConnection, getPlayersInRoom) => {
    playerConnection.on("create_room", (username) => {
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        playerConnection.join(roomId);
        playerConnection.username = username;
        playerConnection.roomId = roomId;

        createRoom(roomId, playerConnection, username);

        playerConnection.emit("room_created", roomId);

        gameServer.to(roomId).emit("update_players", getPlayersInRoom(roomId));

        console.log(`User ${username} created room ${roomId}`);
    });

    playerConnection.on("join_room", ({ username, roomId }) => {
        const success = joinRoom(roomId, playerConnection, username);

        if (success) {
            playerConnection.join(roomId);
            playerConnection.username = username;
            playerConnection.roomId = roomId;

            playerConnection.emit("room_joined", roomId);

            gameServer.to(roomId).emit("update_players", getPlayersInRoom(roomId));

            console.log(`User ${username} joined room ${roomId}`);
        } else {
            const room = rooms[roomId];
            if (!room) {
                playerConnection.emit("error", "Room not found");
            } else if (room.players.length >= 2) {
                playerConnection.emit("error", "Room is full");
            } else {
                playerConnection.emit("error", "Failed to join room");
            }
        }
        console.log('Room status', rooms[roomId]?.game.status);
    });

    playerConnection.on("disconnect", () => {
        console.log("User disconnected:", playerConnection.id);

        const roomId = playerConnection.roomId;
        removePlayer(playerConnection.id);

        if (roomId) {
            gameServer.to(roomId).emit("update_players", getPlayersInRoom(roomId));
        }
    });
};
