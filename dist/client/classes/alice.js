import { Player } from './player';
export class Alice extends Player {
    constructor(scene, x, y, playerId) {
        super(scene, x, y, 'alice', playerId);
        this.initAnimations();
    }
    initAnimations() {
        this.scene.anims.create({
            key: 'alice-walk',
            frames: this.scene.anims.generateFrameNames('a-alice', {
                prefix: 'alice-walk-',
                end: 1,
            }),
            frameRate: 6,
        });
    }
}
//# sourceMappingURL=alice.js.map