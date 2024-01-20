import { connectedPlayers, roomTable } from './room';
export const gamePlayers = {};
export function initPlayers(roomPlayers) {
    Object.keys(roomPlayers).forEach((id, index) => {
        gamePlayers[id] = {
            playerId: id,
            px: index * 100 + 200,
            py: 0,
            vx: 0,
            vy: 0
        };
    });
}
export async function getPlayers(io, socket) {
    const players = [];
    const roomPlayers = await io.in(roomTable[socket.id]).fetchSockets();
    roomPlayers.forEach(soc => {
        players.push(gamePlayers[soc.id]);
    });
    socket.emit('currentGamePlayers', players);
}
export function handlePlayerMove(socket, vx, vy) {
    gamePlayers[socket.id].vx = vx;
    gamePlayers[socket.id].vy = vy;
    socket.broadcast.to(roomTable[socket.id]).emit('playerMoved', {
        playerId: socket.id,
        vx,
        vy
    });
}
export function handlePlayerStop(socket, px, py) {
    gamePlayers[socket.id].px = px;
    gamePlayers[socket.id].py = py;
    socket.broadcast.to(roomTable[socket.id]).emit('playerAdjust', {
        playerId: socket.id,
        px,
        py
    });
}
export function handlePlayerDisconnect(io, socket) {
    delete gamePlayers[socket.id];
    delete connectedPlayers[roomTable[socket.id]][socket.id];
    io.to(roomTable[socket.id]).emit('playerLeft', socket.id);
}
// Add other ingame logic functions as needed...
//# sourceMappingURL=game.js.map