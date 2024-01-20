import { GameScene } from '../gameScene';

export class Beginner extends GameScene {
    constructor() {
        super('beginner-scene');
    }
    initMap(): void {
        this.map = this.make.tilemap({ key: 'map' });
        this.tileset = this.map.addTilesetImage('maptiles', 'tileset') || undefined;
        console.log(this.tileset)
        //this.groundLayer = this.map.createLayer('Tile Layer 1', this.tileset || [], 0, 0) || undefined;
        this.wallsLayer = this.map.createLayer('Tile Layer 1', this.tileset || []) || undefined;
        this.wallsLayer?.setCollisionByProperty({ collides: true });

        this.physics.world.setBounds(0, 0, this.wallsLayer?.width || 100, this.wallsLayer?.height || 100);
        console.log(this.wallsLayer)
        //this.groundLayer = this.map.createLayer('Tile Layer 2', this.tileset || []) || undefined;
    }
}