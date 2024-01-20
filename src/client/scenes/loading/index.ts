import { GameObjects, Scene } from 'phaser';
export class LoadingScene extends Scene {
    private player!: GameObjects.Sprite;
    constructor() {
        super('loading-scene');
    }
    create(): void {
        this.scene.start('menu-scene');
    }
    preload(): void {
        this.load.baseURL = './src/client/assets/';
        this.load.image('player', 'sprites/player0.png');
        this.load.atlas('a-player', 'spritesheets/player-sheet.png', 'spritesheets/player-atlas.json');
        this.load.image('bob', 'sprites/player-bob.png');
        this.load.atlas('a-bob', 'spritesheets/player-sheet-bob.png', 'spritesheets/player-atlas-bob.json');
        this.load.image('alice', 'sprites/player-alice.png');
        this.load.atlas('a-alice', 'spritesheets/player-sheet-alice.png', 'spritesheets/player-atlas-alice.json');
        this.load.image({
            key: 'tileset',
            url: 'tilemaps/tiles/tileset2.png',
          });
        this.load.tilemapTiledJSON('map', 'tilemaps/json/map.json');
    }
}