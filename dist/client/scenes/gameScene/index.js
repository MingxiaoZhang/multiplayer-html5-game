import { OtherPlayer } from '../../classes/otherPlayer';
import { Alice } from '../../classes/alice';
import { Bob } from '../../classes/bob';
import { MultiScene } from '../multiscene';
export class GameScene extends MultiScene {
    isSingle;
    room;
    player;
    otherPlayers;
    characterMap;
    map;
    tileset;
    wallsLayer;
    groundLayer;
    constructor(scene) {
        super(scene);
        this.isSingle = true;
    }
    init(params) {
        if (params.isSingle) {
            return;
        }
        this.isSingle = false;
        super.init({ socket: params.socket });
        this.room = params.room;
        this.characterMap = params.characters;
        this.socket.on('currentGamePlayers', (players) => {
            if (this.player !== undefined) {
                return;
            }
            players.forEach((player) => {
                if (player.playerId === this.socket.id) {
                    this.addPlayer(player);
                }
                else {
                    this.addOtherPlayer(player);
                }
            });
        });
        this.socket.on('playerMoved', (playerInfo) => {
            this.otherPlayers?.getChildren().forEach((otherPlayer) => {
                if (playerInfo.playerId === otherPlayer.playerId) {
                    otherPlayer.setVelocity(playerInfo.vx, playerInfo.vy);
                }
            });
        });
        this.socket.on('playerAdjust', (playerInfo) => {
            this.otherPlayers?.getChildren().forEach((otherPlayer) => {
                if (playerInfo.playerId === otherPlayer.playerId) {
                    otherPlayer.setPosition(playerInfo.px, playerInfo.py);
                    otherPlayer.setVelocity(0, 0);
                }
            });
        });
        this.socket.on('newPlayer', (playerInfo) => {
            this.addOtherPlayer(playerInfo);
        });
        this.socket.on('unconnect', (playerId) => {
            this.otherPlayers?.getChildren().forEach((otherPlayer) => {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy();
                }
            });
        });
    }
    create() {
        this.initMap();
        if (this.isSingle) {
            this.addPlayer({ playerId: 'alice', px: 150, py: 20, vx: 0, vy: 0 });
            return;
        }
        this.otherPlayers = this.physics.add.group();
        this.socket.emit('joinGame', this.room);
    }
    update() {
        if (this.player) {
            this.player.update();
        }
        this.otherPlayers && this.otherPlayers?.getChildren().forEach((otherPlayer) => {
            otherPlayer.update();
        });
    }
    addPlayer(playerData) {
        if (this.characterMap?.[playerData.playerId] === 'alice') {
            this.player = new Alice(this, playerData.px, playerData.py, playerData.playerId);
        }
        else {
            this.player = new Bob(this, playerData.px, playerData.py, playerData.playerId);
        }
        if (this.wallsLayer) {
            this.physics.add.collider(this.player, this.wallsLayer);
        }
        this.initCamera();
    }
    addOtherPlayer(playerData) {
        this.otherPlayers?.add(new OtherPlayer(this, playerData.px, playerData.py, this.characterMap?.[playerData.playerId] || '', playerData.playerId));
    }
    initCamera() {
        this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
        this.cameras.main.setBounds(0, 0, this.wallsLayer?.width || 100, this.wallsLayer?.height || 100);
        this.player && this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setZoom(1.5);
    }
    showDebugWalls() {
        const debugGraphics = this.add.graphics().setAlpha(0.7);
        this.wallsLayer?.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        });
    }
}
//# sourceMappingURL=index.js.map