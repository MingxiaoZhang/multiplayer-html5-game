import { GameObjects, Scene } from 'phaser';
import { MultiScene } from '../multiscene';
import { generateRandomString } from '../../../utils/string';
export class MenuScene extends MultiScene {
    constructor() {
        super('menu-scene');
        this.buttons = [];
    }
    create(): void {
        this.cameras.main.setBackgroundColor('#000000');
        this.createButton(
            'Start Single Player',
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 80,
            250,
            60,
            () => {this.startScene('beginner-scene')}
        );
        this.createButton('Create Room',
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            250,
            60,
            this.createRoom);
        this.createButton('Join Room',
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 80,
            250,
            60,
            () => {this.startScene('room-list-scene')});
        const textStyle = { fontFamily: 'Arial', fontSize: 48, color: '#ffffff' };
        const text = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 180, 'MENU', textStyle);
        text.setOrigin(0.5);
    }
    private createRoom() {
        const room = generateRandomString(8);
        this.scene.start('room-scene', {socket: this.socket, room});
    }
}