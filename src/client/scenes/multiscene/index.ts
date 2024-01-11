import { GameObjects, Scene } from 'phaser';
import { Socket } from 'socket.io-client';
export class MultiScene extends Scene {
    socket!: Socket;
    protected buttons: Phaser.GameObjects.Container[];
    constructor(scene: string) {
        super(scene);
        this.buttons = [];
    }
    init(params: { socket: Socket }) {
        this.socket = params.socket;
    }
    protected createButton(
        text: string,
        x: number,
        y: number,
        width: number,
        height: number,
        event: () => void
    ) {
        const button = this.add.container(x, y);
        this.buttons.push(button);
    
        // Button background
        const buttonBg = this.add.rectangle(0, 0, width, height, 0x3498db);
        buttonBg.setOrigin(0.5, 0.5);
        buttonBg.setInteractive();
    
        // Button text
        const buttonText = this.add.text(0, 0, text, { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        buttonText.setOrigin(0.5, 0.5);
    
        // Add the background and text to the container
        button.add([buttonBg, buttonText]);
    
        // Set button click event
        buttonBg.on('pointerdown', event, this);
    }
    protected startScene(scene: string) {
        this.scene.start(scene, {socket: this.socket});
    }
}