import { GameObjects, Scene } from 'phaser';
import { MultiScene } from '../multiscene';
import { Socket } from 'socket.io-client';
import { PlayerRoomData } from '../../../types/player';
import { DEFAULT_CHARACTER, DEFAULT_NAME } from '../../../utils/constants';
export class RoomScene extends MultiScene {
    room: string;
    players: PlayerRoomData[];
    private playerBoxes: Phaser.GameObjects.Container[];
    constructor() {
        super('room-scene');
        this.playerBoxes = [];
        this.room = '';
        this.players = [];
    }
    init(params: {socket: Socket, room: string}) {
        super.init({socket: params.socket});
        this.room = params.room;
        this.players = [{
            playerId: this.socket.id || '',
            playerName: DEFAULT_NAME,
            character: DEFAULT_CHARACTER,
            roomId: this.room
        }]
        this.socket.on('currentRoomPlayers', (players: {[playerId: string]: PlayerRoomData}) => {
            this.players.push(...Object.values(players));
            this.updatePlayers();
        });
        this.socket.on('playerJoined', (player: PlayerRoomData) => {
            console.log('playerJoined:', player);
            this.players.push(player);
            this.updatePlayers();
        });
        this.socket.on('startClientGame', () => {
            this.scene.start('beginner-scene', {
                socket: this.socket,
                room: this.room,
                characters: this.getCharacterMap()
            });
        });
    }
    create(): void {
        this.socket.emit('joinRoom', this.room);
        // Add text indicating waiting for players
        const waitingText = this.add.text(400, 100, 'Waiting for players...', {
            fontSize: '24px',
            color: '#000',
        });
        const textStyle = { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' };
        const text = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 200, `Room: ${this.room}`, textStyle);
        text.setOrigin(0.5);
        waitingText.setOrigin(0.5);
    }
    private updatePlayers() {
        // Clear existing room list text
        this.children.list
          .filter((child) => child instanceof Phaser.GameObjects.Container)
          .forEach((textChild) => textChild.destroy());
    
        // Display the updated room list
        for (let i = 0; i < 4; i++) {
            const isLocalPlayer = i === 0; // Assume the first player is the local player
            let playerBox: Phaser.GameObjects.Container;
            if (i < this.players.length) {
                playerBox = this.createPlayerBox(100 + i * 200, 300, this.players[i], isLocalPlayer);
            } else {
                playerBox = this.createPlayerBox(100 + i * 200, 300, undefined, isLocalPlayer);
            }
            this.playerBoxes.push(playerBox);
        }
        this.createButton(
            "Start Game",
            450,
            500,
            250,
            60,
            () => {
                this.socket.emit('startGame', this.room);
                this.scene.start('beginner-scene', {
                    socket: this.socket,
                    room: this.room,
                    characters: this.getCharacterMap()
                });
            });
    }
    private createPlayerBox(x: number, y: number, player: PlayerRoomData | undefined, isLocalPlayer: boolean): Phaser.GameObjects.Container {
        const playerBox = this.add.container(x, y);
    
        // Background rectangle representing the player box
        const boxBackground = this.add.rectangle(0, 0, 150, 150, isLocalPlayer ? 0x3498db : 0xe74c3c); // Blue for local, Red for remote
        boxBackground.setOrigin(0.5);
        boxBackground.setInteractive();
    
        // Player name text
        const playerNameText = this.add.text(0, -30, player?.playerName || '', {
          fontSize: '18px',
          color: '#fff',
        });
        playerNameText.setOrigin(0.5);
    
        playerBox.add([boxBackground, playerNameText]);
    
        return playerBox;
    }
    private getCharacterMap() {
        console.log(this.players);
        const characterMap: {[ playerId: string ]: string} = {};
        this.players.forEach(player => {
            characterMap[player.playerId] = player.character;
        });
        return characterMap;
    }
}