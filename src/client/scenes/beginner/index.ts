import { GameObjects, Physics, Scene, Tilemaps } from 'phaser';
import { Player } from '../../classes/player';
import io, { Socket } from 'socket.io-client';
import { PlayerGameData, PlayerRoomData } from 'src/types/player';
import { Actor } from '../../classes/actor';
import { OtherPlayer } from '../../classes/otherPlayer';
import { Alice } from '../../classes/alice';
import { Bob } from '../../classes/bob';
import { MultiScene } from '../multiscene';

export class Beginner extends MultiScene {
    private room: string;
    private player!: Player;
    private otherPlayers!: GameObjects.Group;
    private characterMap: { [playerId: string]: string }
    private map!: Tilemaps.Tilemap;
    private tileset!: Tilemaps.Tileset | undefined;
    private wallsLayer!: Tilemaps.TilemapLayer | undefined;
    private groundLayer!: Tilemaps.TilemapLayer | undefined;
    constructor() {
        super('beginner-scene');
        this.characterMap = {};
        this.room = '';
    }
    init(params: { socket: Socket, room: string, characters: { [playerId: string]: string } }) {
        super.init({socket: params.socket});
        this.room = params.room;
        this.characterMap = params.characters;
        console.log(this.characterMap);
        this.socket.on('currentGamePlayers', (players) => {
            if (this.player !== undefined) {
                return
            }
            players.forEach((player: PlayerGameData) => {
                if (player.playerId === this.socket.id) {
                    this.addPlayer(player);
                } else {
                    this.addOtherPlayer(player);
                }
            });
        });
        this.socket.on('playerMoved', (playerInfo) => {
            this.otherPlayers.getChildren().forEach((otherPlayer) => {
                if (playerInfo.playerId === (otherPlayer as OtherPlayer).playerId) {
                    (otherPlayer as OtherPlayer).setVelocity(playerInfo.vx, playerInfo.vy);
                }
            });
        });
        this.socket.on('playerAdjust', (playerInfo) => {
            this.otherPlayers.getChildren().forEach((otherPlayer) => {
                if (playerInfo.playerId === (otherPlayer as OtherPlayer).playerId) {
                    (otherPlayer as OtherPlayer).setPosition(playerInfo.px, playerInfo.py);
                    (otherPlayer as OtherPlayer).setVelocity(0, 0);
                }
            });
        });
        this.socket.on('newPlayer', (playerInfo) => {
            this.addOtherPlayer(playerInfo);
        });
        this.socket.on('unconnect', (playerId) => {
            this.otherPlayers.getChildren().forEach((otherPlayer) => {
                if (playerId === (otherPlayer as Player).playerId) {
                    otherPlayer.destroy();
                }
            });
        });
    }
    create() {
        this.initMap();
        this.otherPlayers = this.physics.add.group();
        this.socket.emit('joinGame', this.room);
	}
    update(): void {
        if (this.player) {
            this.player.update();
        }
        this.otherPlayers.getChildren().forEach((otherPlayer) => {
            otherPlayer.update();
        });
    }
    private addPlayer(playerData: PlayerGameData) {
        if (this.characterMap[playerData.playerId] === 'alice') {
            this.player = new Alice(this, playerData.px, playerData.py, playerData.playerId);
        } else {
            this.player = new Bob(this, playerData.px, playerData.py, playerData.playerId);
        }
        
        if (this.wallsLayer) {
            this.physics.add.collider(this.player, this.wallsLayer);
        }
        this.initCamera();
    }
    private addOtherPlayer(playerData: PlayerGameData) {
        this.otherPlayers.add(new OtherPlayer(this, playerData.px, playerData.py, this.characterMap[playerData.playerId], playerData.playerId));
    }
    private initMap(): void {
        this.map = this.make.tilemap({ key: 'map' });
        this.tileset = this.map.addTilesetImage('maptiles', 'tileset') || undefined;
        console.log(this.tileset)
        //this.groundLayer = this.map.createLayer('Tile Layer 1', this.tileset || [], 0, 0) || undefined;
        this.wallsLayer = this.map.createLayer('Tile Layer 1', this.tileset || []) || undefined;
        this.wallsLayer?.setCollisionByProperty({ collides: true });
        this.physics.world.setBounds(0, 0, this.wallsLayer?.width || 100, this.wallsLayer?.height || 100);
        console.log(this.wallsLayer)
        //this.showDebugWalls();
    }
    private initCamera(): void {
        this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
        this.cameras.main.setBounds(0, 0, this.wallsLayer?.width || 100, this.wallsLayer?.height || 100);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setZoom(1.5);
    }
    private showDebugWalls(): void {
        const debugGraphics = this.add.graphics().setAlpha(0.7);
        this.wallsLayer?.renderDebug(debugGraphics, {
          tileColor: null,
          collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        });
    }
}