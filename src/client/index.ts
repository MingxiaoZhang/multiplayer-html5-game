import { Game, Types } from 'phaser';
import { Beginner, LoadingScene, MenuScene } from './scenes';
import { io } from 'socket.io-client';
import { RoomScene } from './scenes/room';
import { RoomList } from './scenes/roomList';

const gameConfig: Types.Core.GameConfig = {
	title: 'Phaser game tutorial',
  type: Phaser.WEBGL,
  parent: 'game',
  backgroundColor: '#FFFFFF',
  scale: {
    mode: Phaser.Scale.ScaleModes.NONE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  callbacks: {
    postBoot: () => {
      window.sizeChanged();
    },
  },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
  scene: [LoadingScene, Beginner, MenuScene, RoomScene, RoomList],
};

window.sizeChanged = () => {
    if (window.game.isBooted) {
      setTimeout(() => {
        window.game.scale.resize(window.innerWidth, window.innerHeight);
        window.game.canvas.setAttribute(
          'style',
          `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
        );
      }, 100);
    }
  };
  window.onresize = () => window.sizeChanged();

window.game = new Game(gameConfig);

const socket = io('http://localhost:3000')

window.game.scene.start('menu-scene', { socket });