import { MAX_JUMP, MIN_JUMP, PLAYER_SCALE, PLAYER_SIZE_X, PLAYER_SIZE_Y } from '../../utils/constants';
import { Beginner } from '../scenes';
import { GameScene } from '../scenes/gameScene';
import { Actor } from './actor';
import { Player } from './player';
export class Alice extends Player {
  constructor(scene: GameScene, x: number, y: number, playerId: string) {
    super(scene, x, y, 'alice', playerId);
    this.initAnimations();
  }
  private initAnimations(): void {
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