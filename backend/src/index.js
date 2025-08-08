import express from 'express';
import { Server } from 'socket.io';
import Word from "./utils/word.js";
import Player from "./utils/player.js"
import * as http from "node:http";

const app = express();

app.get('/health', (req, res) => {
    console.log('Healthcheck aufgerufen');
    res.send('OK');
});

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const rooms = {};
const words = [
    new Word('Klang', 'Ton'),
    new Word('Melodie', 'Lied'),
    new Word('Rhythmus', 'Takt'),

    // Natur
    new Word('Baum', 'Wald'),
    new Word('Blume', 'Rose'),
    new Word('Berg', 'Gipfel'),
    new Word('Fluss', 'Wasser'),
    new Word('See', 'Teich'),
    new Word('Meer', 'Ozean'),
    new Word('Himmel', 'Wolken'),
    new Word('Sonne', 'Licht'),
    new Word('Mond', 'Nacht'),
    new Word('Stern', 'Galaxie'),
    new Word('Sand', 'Strand'),
    new Word('Wüste', 'Dünen'),
    new Word('Fels', 'Stein'),
    new Word('Erde', 'Boden'),
    new Word('Wiese', 'Gras'),
    new Word('Blatt', 'Pflanze'),
    new Word('Ast', 'Zweig'),
    new Word('Wald', 'Bäume'),
    new Word('Hügel', 'Landschaft'),
    new Word('Tal', 'Gebirge'),

    // Tiere
    new Word('Hund', 'Bellen'),
    new Word('Katze', 'Miauen'),
    new Word('Vogel', 'Fliegen'),
    new Word('Fisch', 'Schwimmen'),
    new Word('Pferd', 'Reiten'),
    new Word('Schaf', 'Wolle'),
    new Word('Kuh', 'Milch'),
    new Word('Schwein', 'Ferkel'),
    new Word('Huhn', 'Ei'),
    new Word('Ente', 'Schnabel'),
    new Word('Biene', 'Honig'),
    new Word('Schmetterling', 'Flügel'),
    new Word('Löwe', 'König'),
    new Word('Tiger', 'Streifen'),
    new Word('Elefant', 'Rüssel'),
    new Word('Affe', 'Banane'),
    new Word('Giraffe', 'Hals'),
    new Word('Fuchs', 'Schlau'),
    new Word('Wolf', 'Rudel'),
    new Word('Eule', 'Weisheit'),

    // Technik
    new Word('Computer', 'PC'),
    new Word('Laptop', 'Notebook'),
    new Word('Handy', 'Smartphone'),
    new Word('Tablet', 'Touch'),
    new Word('Maus', 'Zeiger'),
    new Word('Tastatur', 'Schreiben'),
    new Word('Bildschirm', 'Monitor'),
    new Word('Kamera', 'Foto'),
    new Word('Auto', 'Fahren'),
    new Word('Zug', 'Schienen'),
    new Word('Flugzeug', 'Fliegen'),
    new Word('Rakete', 'Weltraum'),
    new Word('Roboter', 'Maschine'),
    new Word('Drohne', 'Fernsteuerung'),
    new Word('Lampe', 'Licht'),
    new Word('Fernseher', 'TV'),
    new Word('Radio', 'Musik'),
    new Word('Router', 'Internet'),
    new Word('Drucker', 'Papier'),
    new Word('USB', 'Stick'),

    // Essen
    new Word('Apfel', 'Obst'),
    new Word('Banane', 'Gelb'),
    new Word('Orange', 'Zitrus'),
    new Word('Traube', 'Wein'),
    new Word('Kirsche', 'Rot'),
    new Word('Birne', 'Frucht'),
    new Word('Mango', 'Exotisch'),
    new Word('Melone', 'Sommer'),
    new Word('Pfirsich', 'Haarig'),
    new Word('Ananas', 'Tropisch'),
    new Word('Brot', 'Backen'),
    new Word('Brötchen', 'Frühstück'),
    new Word('Kuchen', 'Süß'),
    new Word('Torte', 'Feier'),
    new Word('Schokolade', 'Süßigkeit'),
    new Word('Bonbon', 'Zucker'),
    new Word('Pizza', 'Ofen'),
    new Word('Burger', 'Fastfood'),
    new Word('Pommes', 'Frittieren'),
    new Word('Salat', 'Grün'),

    // Sport
    new Word('Fußball', 'Tor'),
    new Word('Basketball', 'Korb'),
    new Word('Tennis', 'Schläger'),
    new Word('Golf', 'Loch'),
    new Word('Volleyball', 'Netz'),
    new Word('Handball', 'Torwart'),
    new Word('Eishockey', 'Puck'),
    new Word('Boxen', 'Ring'),
    new Word('Schwimmen', 'Wasser'),
    new Word('Laufen', 'Sprint'),
    new Word('Radfahren', 'Fahrrad'),
    new Word('Reiten', 'Pferd'),
    new Word('Skifahren', 'Schnee'),
    new Word('Snowboard', 'Winter'),
    new Word('Surfen', 'Welle'),
    new Word('Segeln', 'Boot'),
    new Word('Klettern', 'Berg'),
    new Word('Yoga', 'Entspannung'),
    new Word('Gymnastik', 'Turnen'),
    new Word('Tanzen', 'Bewegung'),

    // Wissenschaft
    new Word('Atom', 'Teilchen'),
    new Word('Molekül', 'Chemie'),
    new Word('Zelle', 'Biologie'),
    new Word('Planet', 'Sonnensystem'),
    new Word('Stern', 'Licht'),
    new Word('Galaxie', 'Universum'),
    new Word('DNA', 'Genetik'),
    new Word('Protein', 'Eiweiß'),
    new Word('Neuron', 'Nerv'),
    new Word('Physik', 'Kraft'),
    new Word('Chemie', 'Reaktion'),
    new Word('Biologie', 'Leben'),
    new Word('Astronomie', 'Sterne'),
    new Word('Geologie', 'Gestein'),
    new Word('Meteorologie', 'Wetter'),
    new Word('Mathematik', 'Zahlen'),
    new Word('Statistik', 'Daten'),
    new Word('Elektron', 'Ladung'),
    new Word('Photon', 'Licht'),
    new Word('Quark', 'Teilchen'),

    // Städte
    new Word('Berlin', 'Deutschland'),
    new Word('Paris', 'Frankreich'),
    new Word('London', 'England'),
    new Word('Rom', 'Italien'),
    new Word('Madrid', 'Spanien'),
    new Word('Lissabon', 'Portugal'),
    new Word('Wien', 'Österreich'),
    new Word('Zürich', 'Schweiz'),
    new Word('Prag', 'Tschechien'),
    new Word('Athen', 'Griechenland'),
    new Word('New York', 'USA'),
    new Word('Los Angeles', 'Hollywood'),
    new Word('Tokio', 'Japan'),
    new Word('Peking', 'China'),
    new Word('Sydney', 'Australien'),
    new Word('Moskau', 'Russland'),
    new Word('Rio', 'Brasilien'),
    new Word('Kapstadt', 'Südafrika'),
    new Word('Dubai', 'Vereinigte Arabische Emirate'),
    new Word('Istanbul', 'Türkei'),

    // Berufe
    new Word('Arzt', 'Krankenhaus'),
    new Word('Lehrer', 'Schule'),
    new Word('Polizist', 'Gesetz'),
    new Word('Feuerwehrmann', 'Brand'),
    new Word('Pilot', 'Flugzeug'),
    new Word('Ingenieur', 'Technik'),
    new Word('Programmierer', 'Code'),
    new Word('Bäcker', 'Brot'),
    new Word('Koch', 'Küche'),
    new Word('Friseur', 'Haare'),
    new Word('Mechaniker', 'Auto'),
    new Word('Elektriker', 'Strom'),
    new Word('Architekt', 'Plan'),
    new Word('Designer', 'Kreativ'),
    new Word('Journalist', 'Zeitung'),
    new Word('Fotograf', 'Kamera'),
    new Word('Musiker', 'Instrument'),
    new Word('Schauspieler', 'Film'),
    new Word('Richter', 'Gericht'),
    new Word('Anwalt', 'Recht')
];

function generateRoomID() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

io.on('connection', (socket) => {
    console.log("A user connected:", socket.id);

    socket.on('createRoom', (playerName) => {
        const roomId = generateRoomID();
        const word = getRandomWord();
        rooms[roomId] = { players: [new Player(playerName, true)], word, impostor: '' };

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
        room.players.push(new Player(player, false));
        socket.join(roomId);

        socket.emit('roomCreated', { roomId, players: room.players });

        io.to(roomId).emit('roomUpdate', { players: room.players });
    });

    socket.on('startGame', (roomId) => {
        const room = rooms[roomId];
        console.log(room.players)
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

    socket.on('leaveRoom', (data) => {
        console.log(`Player ${data.player} is leaving room ${data.roomId}`);


        const room = rooms[data.roomId];
        if (!room) {
            socket.emit('errorMessage', 'Room not found');
            return;
        }

        console.log(data)
        console.log(`Current players in room ${data.roomId}:`);
        console.log(room.players.map(player => player.playerName));


        console.log(room.players);

        const playerIndex = room.players.findIndex(player => player.playerName === data.player);

        console.log("playerIndex", playerIndex);

        if (playerIndex !== -1) {
            console.log(`Removing player ${data.player} from room ${data.roomId}`);
            room.players.splice(playerIndex, 1);
        }

        socket.leave(data.roomId);

        socket.emit('playerLeft', { roomId: data.roomId, players: room.players });
        io.to(data.roomId).emit('roomUpdate', { players: room.players });

        const activeRooms = Object.keys(rooms).length;
        io.emit('activeRoomsCount', activeRooms);  // An alle senden
    });
});

httpServer.listen(3000, () => console.log('Server running on http://localhost:3000'));