import { Player } from './player';
export class Bob extends Player {
    constructor(scene, x, y, playerId) {
        super(scene, x, y, 'bob', playerId);
        this.initAnimations();
    }
    initAnimations() {
        this.scene.anims.create({
            key: 'bob-walk',
            frames: this.scene.anims.generateFrameNames('a-bob', {
                prefix: 'bob-walk-',
                end: 1,
            }),
            frameRate: 6,
        });
    }
}
//# sourceMappingURL=bob.js.map