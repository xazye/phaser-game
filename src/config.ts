import { GameScene } from "./scenes/GameScene"
export const GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: GameScene,
    parent: 'phaser-game',
  }
  