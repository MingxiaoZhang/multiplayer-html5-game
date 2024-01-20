import { Scene } from 'phaser';
export class MultiScene extends Scene {
    socket;
    buttons;
    constructor(scene) {
        super(scene);
        this.buttons = [];
    }
    init(params) {
        this.socket = params.socket;
    }
    createButton(text, x, y, width, height, event) {
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
    startScene(scene) {
        this.scene.start(scene, { socket: this.socket });
    }
}
//# sourceMappingURL=index.js.map