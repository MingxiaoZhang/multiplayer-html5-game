import { MAX_JUMP, MIN_JUMP, PLAYER_SCALE, PLAYER_SIZE_X, PLAYER_SIZE_Y } from '../../utils/constants';
import { Beginner } from '../scenes';
import { GameScene } from '../scenes/gameScene';
import { Actor } from './actor';
export class Player extends Actor {
  playerId: string;
  private prevX: number;
  private prevY: number;
  private keyW: Phaser.Input.Keyboard.Key | undefined;
  private keyA: Phaser.Input.Keyboard.Key | undefined;
  private keyS: Phaser.Input.Keyboard.Key | undefined;
  private keyD: Phaser.Input.Keyboard.Key | undefined;
  private keyJ: Phaser.Input.Keyboard.Key | undefined;
  private keyK: Phaser.Input.Keyboard.Key | undefined;
  character: string;
  constructor(scene: GameScene, x: number, y: number, character: string, playerId: string) {
    super(scene, x, y, `a-${character}`, `${character}-stand`);
    this.playerId = playerId;
    this.character = character;
    this.prevX = 0;
    this.prevY = 0;
    // KEYS
    if (!this.scene.input.keyboard) {
        return
    }
    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('D');
    this.keyJ = this.scene.input.keyboard.addKey('J');
    this.keyK = this.scene.input.keyboard.addKey('K');

    // PHYSICS
    this.getBody().setSize(PLAYER_SIZE_X, PLAYER_SIZE_Y);
    this.getBody().setOffset(0, 0);
  }
  update(): void {
    if (!(this.scene as GameScene).isSingle){
      if ((Math.abs(this.getBody().velocity.x) > 10 
        || Math.abs(this.getBody().velocity.y) > 10) 
        && (this.prevX !== this.getBody().position.x
        || this.prevY !== this.getBody().position.y)) {
        (this.scene as Beginner).socket.emit('playerMoveEmit', {
          vx: (this.prevX !== this.getBody().position.x) ? this.getBody().velocity.x : 0,
          vy: (this.prevY !== this.getBody().position.y) ? this.getBody().velocity.y : 0,
        });
        this.prevX = this.getBody().position.x;
        this.prevY = this.getBody().position.y;
      } else {
        (this.scene as Beginner).socket.emit('playerStopEmit', {
          px: this.getBody().position.x + 25,
          py: this.getBody().position.y + 40,
        });
      }
    }
    if (this.getBody().onFloor()) {
      this.getBody().setVelocityX(0);
    }
    
    if (this.keyK?.isDown) {
      if (this.getBody().onFloor()) this.getBody().setVelocityY(-300);
    } else {
      const vy = this.getBody().velocity.y;
      if (vy < 0) {
        this.getBody().setVelocityY(vy * 0.5);
      } 
    }
    if (this.keyA?.isDown && !this.getBody().embedded) {
      this.getBody().velocity.x = -110;
      this.checkFlip();
      this.getBody().setOffset(100, 0);
      !this.anims.isPlaying && this.anims.play(`${this.character}-walk`, true);
    }
    if (this.keyD?.isDown) {
      this.getBody().velocity.x = 110;
      this.checkFlip();
      this.getBody().setOffset(PLAYER_SIZE_X + 100, 0);
      !this.anims.isPlaying && this.anims.play(`${this.character}-walk`, true);
    }
    !this.anims.isPlaying && this.setFrame(`${this.character}-stand`);
  }
}