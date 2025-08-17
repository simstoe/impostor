import {
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    stopGame,
    endGame,
    getActiveRoomsCount
} from "../services/roomService.js";

export default function registerGameSocket(io) {
    io.on('connection', (socket) => {
        console.log("A user connected:", socket.id);

        socket.on('createRoom', (playerName) => {
            const { roomId, room } = createRoom(playerName);
            socket.join(roomId);
            socket.emit('roomCreated', { roomId, players: room.players });
            io.to(roomId).emit('roomUpdate', { players: room.players });
        });

        socket.on('joinRoom', ({ roomId, player }) => {
            const room = joinRoom(roomId, player);
            if (!room) {
                socket.emit('errorMessage', 'Room not found');
                return;
            }
            socket.join(roomId);
            socket.emit('roomCreated', { roomId, players: room.players });
            io.to(roomId).emit('roomUpdate', { players: room.players });
        });

        socket.on('startGame', (roomId) => {
            const room = startGame(roomId);
            if (!room) return;
            io.to(roomId).emit('gameStarted', {
                impostor: room.impostor,
                word: room.word.word,
                hint: room.word.hint
            });
        });

        socket.on('stopGame', (roomId) => {
            const room = stopGame(roomId);
            if (!room) return;
            io.to(roomId).emit('gameStopped');
        });

        socket.on('leaveRoom', ({ roomId, player }) => {
            const room = leaveRoom(roomId, player);
            if (!room) {
                socket.emit('errorMessage', 'Room not found');
                return;
            }
            socket.leave(roomId);
            socket.emit('playerLeft', { roomId, players: room.players });
            io.to(roomId).emit('roomUpdate', { players: room.players });

            io.emit('activeRoomsCount', getActiveRoomsCount());
        });

        socket.on('endGame', (roomId) => {
            const impostor = endGame(roomId);
            io.to(roomId).emit('gameOver', { impostor });
        });
    });
}
