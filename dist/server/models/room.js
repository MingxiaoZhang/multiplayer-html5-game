import { DEFAULT_CHARACTER, DEFAULT_NAME } from '../../utils/constants';
export const connectedPlayers = {};
export const roomTable = {};
export async function handleJoinRoom(io, socket, roomName) {
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
export function handleLeaveRoom(io, socket, room) {
    socket.leave(room);
    delete connectedPlayers[room][socket.id];
    delete roomTable[socket.id];
    io.to(room).emit('playerLeft', { playerId: socket.id });
}
export function handleStartGame(io, socket, room) {
    io.to(room).emit('startClientGame');
}
export function handleGetRooms(io, socket) {
    socket.emit('roomList', Object.keys(connectedPlayers));
}
//# sourceMappingURL=room.js.map