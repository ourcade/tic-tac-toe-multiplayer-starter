import 'regenerator-runtime/runtime'
import Phaser from 'phaser'

import Bootstrap from './scenes/Bootstrap'
import Game from './scenes/Game'
import GameOver from './scenes/GameOver'

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
	scene: [Bootstrap, Game, GameOver]
}

export default new Phaser.Game(config)
