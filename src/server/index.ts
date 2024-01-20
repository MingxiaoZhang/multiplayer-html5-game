import express from 'express';
import http from 'http';
import path from 'path';
import {fileURLToPath} from 'url';
import { Server } from 'socket.io';
import { handlePlayerMove, handlePlayerStop, handlePlayerDisconnect, initPlayers, getPlayers } from './models/game';
import { connectedPlayers, handleGetRooms, handleJoinRoom, handleLeaveRoom, handleStartGame } from './models/room';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*',
    }
});

const PORT = 3000;

app.use(express.static(__dirname + '/public/index.html'));
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('playerMoveEmit', ({vx, vy}) => {
    handlePlayerMove(socket, vx, vy);
  });

  socket.on('playerStopEmit', ({px, py}) => {
    handlePlayerStop(socket, px, py);
  });

  socket.on('unconnect', () => {
    handlePlayerDisconnect(io, socket);
  });

  socket.on('getRoomList', () => {
    handleGetRooms(io, socket);
  });

  socket.on('joinRoom', (room) => {
    handleJoinRoom(io, socket, room);
  });

  socket.on('leaveRoom', (room) => {
    handleLeaveRoom(io, socket, room);
  });

  socket.on('startGame', (room) => {
    initPlayers(connectedPlayers[room]);
    handleStartGame(io, socket, room);
  });

  socket.on('joinGame', () => {
    getPlayers(io, socket);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
