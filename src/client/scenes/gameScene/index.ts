import { GameObjects, Physics, Scene, Tilemaps } from 'phaser';
import { Player } from '../../classes/player';
import io, { Socket } from 'socket.io-client';
import { PlayerGameData, PlayerRoomData } from 'src/types/player';
import { Actor } from '../../classes/actor';
import { OtherPlayer } from '../../classes/otherPlayer';
import { Alice } from '../../classes/alice';
import { Bob } from '../../classes/bob';
import { MultiScene } from '../multiscene';

export abstract class GameScene extends MultiScene {
    isSingle: boolean;
    protected room: string | undefined;
    protected player: Player | undefined;
    protected otherPlayers: GameObjects.Group | undefined;
    protected characterMap: { [playerId: string]: string } | undefined;
    protected map!: Tilemaps.Tilemap;
    protected tileset!: Tilemaps.Tileset | undefined;
    protected wallsLayer!: Tilemaps.TilemapLayer | undefined;
    protected groundLayer!: Tilemaps.TilemapLayer | undefined;
    constructor(scene: string) {
        super(scene);
        this.isSingle = true;
    }
    init(params: { isSingle: boolean, socket: Socket, room?: string, characters?: { [playerId: string]: string } }) {
        if (params.isSingle) {
            return;
        }
        this.isSingle = false;
        super.init({socket: params.socket});
        this.room = params.room;
        this.characterMap = params.characters;
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
            this.otherPlayers?.getChildren().forEach((otherPlayer) => {
                if (playerInfo.playerId === (otherPlayer as OtherPlayer).playerId) {
                    (otherPlayer as OtherPlayer).setVelocity(playerInfo.vx, playerInfo.vy);
                }
            });
        });
        this.socket.on('playerAdjust', (playerInfo) => {
            this.otherPlayers?.getChildren().forEach((otherPlayer) => {
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
            this.otherPlayers?.getChildren().forEach((otherPlayer) => {
                if (playerId === (otherPlayer as Player).playerId) {
                    otherPlayer.destroy();
                }
            });
        });
    }
    create() {
        this.initMap();
        if (this.isSingle) {
            this.addPlayer({playerId: 'alice', px: 150, py: 20, vx: 0, vy: 0});
            return
        }
        this.otherPlayers = this.physics.add.group();
        this.socket.emit('joinGame', this.room);
	}
    update(): void {
        if (this.player) {
            this.player.update();
        }
        this.otherPlayers && this.otherPlayers?.getChildren().forEach((otherPlayer) => {
            otherPlayer.update();
        });
    }
    private addPlayer(playerData: PlayerGameData) {
        if (this.characterMap?.[playerData.playerId] === 'alice') {
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
        this.otherPlayers?.add(new OtherPlayer(this, playerData.px, playerData.py, this.characterMap?.[playerData.playerId] || '', playerData.playerId));
    }
    abstract initMap(): void;
    private initCamera(): void {
        this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
        this.cameras.main.setBounds(0, 0, this.wallsLayer?.width || 100, this.wallsLayer?.height || 100);
        this.player && this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
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