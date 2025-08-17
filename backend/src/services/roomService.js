import Player from "../models/Player.js";
import { getRandomWord } from "./wordService.js";

const rooms = {};

export function generateRoomID() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function createRoom(playerName) {
    const roomId = generateRoomID();
    const word = getRandomWord();
    rooms[roomId] = { players: [new Player(playerName, true)], word, impostor: '' };
    return { roomId, room: rooms[roomId] };
}

export function joinRoom(roomId, playerName) {
    const room = rooms[roomId];
    if (!room) return null;
    room.players.push(new Player(playerName, false));
    return room;
}

export function leaveRoom(roomId, playerName) {
    const room = rooms[roomId];
    if (!room) return null;
    const idx = room.players.findIndex(p => p.playerName === playerName);
    if (idx !== -1) room.players.splice(idx, 1);
    return room;
}

export function startGame(roomId) {
    const room = rooms[roomId];
    if (!room) return null;
    room.impostor = room.players[Math.floor(Math.random() * room.players.length)];
    return room;
}

export function stopGame(roomId) {
    const room = rooms[roomId];
    if (!room) return null;
    room.impostor = '';
    room.word = getRandomWord();
    return room;
}

export function endGame(roomId) {
    return rooms[roomId]?.impostor || null;
}

export function getActiveRoomsCount() {
    return Object.keys(rooms).length;
}
