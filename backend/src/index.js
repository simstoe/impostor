import express from "express";
import http from "http";
import { Server } from "socket.io";
import registerGameSocket from "./sockets/game.socket.js";

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, { cors: { origin: "*" } });
registerGameSocket(io);

httpServer.listen(3000, () => console.log('Server running on http://localhost:3000'));
