import { Physics } from 'phaser';
import { PLAYER_SCALE } from '../../utils/constants';
export class Actor extends Physics.Arcade.Sprite {
    hp = 100;
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.getBody().setCollideWorldBounds(true);
        this.scale = PLAYER_SCALE;
        this.getBody().setGravityY(500);
        this.getBody().bounce.setTo(0.3, 0.1);
        this.setOrigin(0.5, 0.5);
    }
    getDamage(value) {
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: 3,
            yoyo: true,
            alpha: 0.5,
            onStart: () => {
                if (value) {
                    this.hp = this.hp - value;
                }
            },
            onComplete: () => {
                this.setAlpha(1);
            },
        });
    }
    getHPValue() {
        return this.hp;
    }
    checkFlip() {
        if (this.body?.velocity.x && this.body.velocity.x < 0) {
            this.scaleX = PLAYER_SCALE;
        }
        else {
            this.scaleX = -1 * PLAYER_SCALE;
        }
    }
    getBody() {
        return this.body;
    }
}
//# sourceMappingURL=actor.js.map