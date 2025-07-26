import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Word from "./utils/word.js";

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const rooms = {};
const words = [
    new Word('Klang', 'Ton'),
    new Word('Melodie', 'Lied'),
    new Word('Rhythmus', 'Takt')
]

function generateRoomID() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    socket.on('createRoom', (playerName) => {
        const roomId = generateRoomID();
        const word = getRandomWord();
        rooms[roomId] = { players: [playerName], word, impostor: '' };

        socket.join(roomId);

        socket.emit('roomCreated', { roomId, players: rooms[roomId].players });

        io.to(roomId).emit('roomUpdate', { players: rooms[roomId].players });

        console.log(`Room ${roomId} created with word: ${word}`);
    });

    socket.on('joinRoom', ({ roomId, player }) => {
        const room = rooms[roomId];
        if (!room) {
            socket.emit('errorMessage', 'Room not found');
            return;
        }
        room.players.push(player);
        socket.join(roomId);

        socket.emit('roomCreated', { roomId, players: room.players });

        io.to(roomId).emit('roomUpdate', { players: room.players });
    });


    socket.on('startGame', (roomId) => {
        const room = rooms[roomId];
        if (!room) return;
        room.impostor = room.players[Math.floor(Math.random() * room.players.length)];
        io.to(roomId).emit('gameStarted', {
            impostor: room.impostor,
            word: room.word.word,
            hint: room.word.hint
        });
    });

    socket.on('stopGame', (roomId) => {
        const room = rooms[roomId];

        if (!room) return;

        room.impostor = '';
        room.word = getRandomWord();

        io.to(roomId).emit('gameStopped');
    });


});


httpServer.listen(3000, () => console.log('Server running on http://localhost:3000'));