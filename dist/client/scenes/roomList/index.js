import { MultiScene } from '../multiscene';
export class RoomList extends MultiScene {
    roomList;
    constructor() {
        super('room-list-scene');
        this.roomList = [];
    }
    init(params) {
        super.init({ socket: params.socket });
        this.socket.on('roomList', (rooms) => {
            console.log(rooms);
            this.roomList = rooms;
            this.updateRoomList();
        });
    }
    create() {
        this.socket.emit('getRoomList');
    }
    updateRoomList() {
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
    enterRoom(room) {
        // Navigate to the corresponding room scene
        this.scene.start('room-scene', { socket: this.socket, room });
    }
}
//# sourceMappingURL=index.js.map