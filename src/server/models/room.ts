import { Server, Socket } from 'socket.io';
import { PlayerRoomData } from '../../types/player';
import { DEFAULT_CHARACTER, DEFAULT_NAME } from '../../utils/constants';

export const connectedPlayers: { [roomName: string]: { [playerId: string]: PlayerRoomData } } = {};
export const roomTable: { [playerId: string]: string} = {};

export async function handleJoinRoom(io: Server, socket: Socket, roomName: string) {
  socket.join(roomName);
  if (!connectedPlayers.hasOwnProperty(roomName)) {
    connectedPlayers[roomName] = {};
  } 
  socket.emit('currentRoomPlayers', connectedPlayers[roomName]);
  connectedPlayers[roomName][socket.id] = {
    playerId: socket.id,
    playerName: DEFAULT_NAME,
    roomId: roomName,
    character: DEFAULT_CHARACTER
  };
  socket.broadcast.to(roomName).emit('playerJoined', connectedPlayers[roomName][socket.id]);
  roomTable[socket.id] = roomName;
}

export function handleLeaveRoom(io: Server, socket: Socket, room: string) {
  socket.leave(room);
  delete connectedPlayers[room][socket.id];
  delete roomTable[socket.id]; 
  io.to(room).emit('playerLeft', { playerId: socket.id });
}

export function handleStartGame(io: Server, socket: Socket, room: string) {
  io.to(room).emit('startClientGame');
}

export function handleGetRooms(io: Server, socket: Socket) {
  socket.emit('roomList', Object.keys(connectedPlayers))
}
