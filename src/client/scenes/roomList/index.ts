import { GameObjects, Scene } from 'phaser';
import { MultiScene } from '../multiscene';
import { Socket } from 'socket.io-client';
export class RoomList extends MultiScene {
    private roomList: string[];
    constructor() {
        super('room-list-scene');
        this.roomList = [];
    }
    init(params: {socket: Socket}) {
        super.init({socket: params.socket});
        this.socket.on('roomList', (rooms: string[]) => {
            console.log(rooms)
            this.roomList = rooms;
            this.updateRoomList();
        });
    }
    create(): void {
        this.socket.emit('getRoomList');
    }
    private updateRoomList() {
        // Clear existing room list text
        this.children.list
          .filter((child) => child instanceof Phaser.GameObjects.Text)
          .forEach((textChild) => textChild.destroy());
    
        // Display the updated room list
        for (let i = 0; i < this.roomList.length; i++) {
          const roomText = this.add.text(400, 150 + i * 30, this.roomList[i], {
            fontSize: '18px',
            color: '#000',
          });
          roomText.setOrigin(0.5);
          roomText.setInteractive({ useHandCursor: true });
          roomText.on('pointerup', () => this.enterRoom(this.roomList[i]));
        }
    }
    private enterRoom(room: string) {
        // Navigate to the corresponding room scene
        this.scene.start('room-scene', { socket: this.socket, room });
    }
}