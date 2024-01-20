import { Server, Socket } from 'socket.io';
import { PlayerGameData, PlayerRoomData } from '../../types/player';
import { connectedPlayers, roomTable } from './room';

export const gamePlayers: {[playerId: string] : PlayerGameData} = {};

export function initPlayers(roomPlayers: { [playerId: string]: PlayerRoomData }) {
    Object.keys(roomPlayers).forEach((id, index) => {
        gamePlayers[id] = {
            playerId: id,
            px: index * 100 + 200,
            py: 0,
            vx: 0,
            vy: 0
        }
    })
}

export async function getPlayers(io: Server, socket: Socket) {
    const players: PlayerGameData[] = [];
    const roomPlayers = await io.in(roomTable[socket.id]).fetchSockets();
    roomPlayers.forEach(soc => {
        players.push(gamePlayers[soc.id]);
    });
    socket.emit('currentGamePlayers', players);
}

export function handlePlayerMove(socket: Socket, vx: number, vy: number) {
    gamePlayers[socket.id].vx = vx;
    gamePlayers[socket.id].vy = vy;
    socket.broadcast.to(
        roomTable[socket.id]
    ).emit('playerMoved', {
        playerId: socket.id,
        vx,
        vy
    });
}

export function handlePlayerStop(socket: Socket, px: number, py: number) {
    gamePlayers[socket.id].px = px;
    gamePlayers[socket.id].py = py;
    socket.broadcast.to(
        roomTable[socket.id]
    ).emit('playerAdjust', {
        playerId: socket.id,
        px,
        py
    });
}

export function handlePlayerDisconnect(io: Server, socket: Socket) {
    delete gamePlayers[socket.id];
    delete connectedPlayers[roomTable[socket.id]][socket.id];
    io.to(roomTable[socket.id]).emit('playerLeft', socket.id);
  }
  

// Add other ingame logic functions as needed...
