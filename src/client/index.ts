// import 'regenerator-runtime/runtime'
import Phaser from 'phaser'

import BootstrapScene from './scenes/BootstrapScene'
import GameScene from './scenes/GameScene'
import GameOverScene from './scenes/GameOverScene'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: [BootstrapScene, GameScene, GameOverScene]
}

export default new Phaser.Game(config)
