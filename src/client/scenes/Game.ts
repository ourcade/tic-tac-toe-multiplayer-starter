import Phaser from 'phaser'
import { IGameOverSceneData, IGameSceneData } from '../../types/scenes'
import ITicTacToeState, { Cell, GameState } from '../../types/ITicTacToeState'
import type Server from '../services/Server'

export default class Game extends Phaser.Scene
{
	private server?: Server
	private onGameOver?: (data: IGameOverSceneData) => void

	private gameStateText?: Phaser.GameObjects.Text

	private cells: { display: Phaser.GameObjects.Rectangle, value: Cell }[] = []

	constructor()
	{
		super('game')
	}

	init()
	{
		this.cells = []
	}

	async create(data: IGameSceneData)
	{
		const { server, onGameOver } = data

		this.server = server
		this.onGameOver = onGameOver

		if (!this.server)
		{
			throw new Error('server instance missing')
		}

		await this.server.join()

		this.server.onceStateChanged(this.createBoard, this)
	}

	private createBoard(state: ITicTacToeState)
	{
		const { width, height } = this.scale
		const size = 128

		let x = (width * 0.5) - size
		let y = (height * 0.5) - size
		state.board.forEach((cellState, idx) => {
			const cell = this.add.rectangle(x, y, size, size, 0xffffff)
				.setInteractive()
				.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
					this.server?.makeSelection(idx)
				})

			switch (cellState)
			{
				case Cell.X:
				{
					this.add.star(cell.x, cell.y, 4, 4, 60, 0xff0000)
						.setAngle(45)
					break
				}

				case Cell.O:
				{
					this.add.circle(cell.x, cell.y, 50, 0x0000ff)
					break
				}
			}

			this.cells.push({
				display: cell,
				value: cellState 
			})

			x += size + 5

			if ((idx + 1) % 3 === 0)
			{
				y += size + 5
				x = (width * 0.5) - size
			}
		})

		if (this.server?.gameState === GameState.WaitingForPlayers)
		{
			const width = this.scale.width
			this.gameStateText = this.add.text(width * 0.5, 50, 'Waiting for opponent...')
				.setOrigin(0.5)
		}

		this.server?.onBoardChanged(this.handleBoardChanged, this)
		this.server?.onPlayerTurnChanged(this.handlePlayerTurnChanged, this)
		this.server?.onPlayerWon(this.handlePlayerWon, this)
		this.server?.onGameStateChanged(this.handleGameStateChanged, this)
	}

	private handleBoardChanged(newValue: Cell, idx: number)
	{
		const cell = this.cells[idx]
		if (cell.value !== newValue)
		{
			switch (newValue)
			{
				case Cell.X:
				{
					this.add.star(cell.display.x, cell.display.y, 4, 4, 60, 0xff0000)
						.setAngle(45)
					break
				}

				case Cell.O:
				{
					this.add.circle(cell.display.x, cell.display.y, 50, 0x0000ff)
					break
				}
			}

			cell.value = newValue
		}
	}

	private handlePlayerTurnChanged(playerIndex: number)
	{
		// TODO: show a message letting the player know it is their turn
	}

	private handlePlayerWon(playerIndex: number)
	{
		this.time.delayedCall(1000, () => {
			if (!this.onGameOver)
			{
				return
			}

			this.onGameOver({
				winner: this.server?.playerIndex === playerIndex
			})
		})
	}

	private handleGameStateChanged(state: GameState)
	{
		if (state === GameState.Playing && this.gameStateText)
		{
			this.gameStateText.destroy()
			this.gameStateText = undefined
		}
	}
}