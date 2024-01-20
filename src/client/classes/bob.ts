import { MAX_JUMP, MIN_JUMP, PLAYER_SCALE, PLAYER_SIZE_X, PLAYER_SIZE_Y } from '../../utils/constants';
import { Beginner } from '../scenes';
import { GameScene } from '../scenes/gameScene';
import { Actor } from './actor';
import { Player } from './player';
export class Bob extends Player {
  constructor(scene: GameScene, x: number, y: number, playerId: string) {
    super(scene, x, y, 'bob', playerId);
    this.initAnimations();
  }
  private initAnimations(): void {
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