import { MAX_JUMP, MIN_JUMP, PLAYER_SCALE, PLAYER_SIZE_X, PLAYER_SIZE_Y } from '../../utils/constants';
import { Beginner } from '../scenes';
import { Actor } from './actor';
export class OtherPlayer extends Actor {
  playerId: string;
  character: string;
  constructor(scene: Phaser.Scene, x: number, y: number, character: string, playerId: string) {
    super(scene, x, y, `a-${character}`, 'stand');
    this.playerId = playerId;
    this.character = character;
    this.initAnimations();
    // KEYS
    if (!this.scene.input.keyboard) {
        return
    }

    // PHYSICS
    this.getBody().setSize(PLAYER_SIZE_X, PLAYER_SIZE_Y);
    this.getBody().setOffset(100, 0);
  }
  update(): void {
    if (this.getBody().velocity.x < 0) {
        this.scaleX = PLAYER_SCALE;
        this.getBody().setOffset(100, 0);
        !this.anims.isPlaying && this.anims.play('run', true);
    } else if (this.getBody().velocity.x > 0) {
        this.scaleX = -1 * PLAYER_SCALE;
        this.getBody().setOffset(PLAYER_SIZE_X + 100, 0);
        !this.anims.isPlaying && this.anims.play('run', true);
    } else {
        this.anims.pause();
        this.setFrame(`${this.character}-stand`);
    }
  }
  private initAnimations(): void {
    this.scene.anims.create({
      key: 'run',
      frames: this.scene.anims.generateFrameNames(`a-${this.character}`, {
        prefix: `${this.character}-walk-`,
        end: 1,
      }),
      frameRate: 6,
    });
  }
  setPlayerPosition(x: number, y: number){
    this.setPosition(x, y);
  }
}