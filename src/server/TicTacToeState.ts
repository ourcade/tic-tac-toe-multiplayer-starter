import { Schema, ArraySchema, type } from '@colyseus/schema'

import ITicTacToeState from '../types/ITicTacToeState'

export default class TicTacToeState extends Schema implements ITicTacToeState
{
	@type(['number'])
	board: ArraySchema<number>

	@type('number')
	activePlayer = 0

	constructor()
	{
		super()

		this.board = new ArraySchema(
			0, 0, 0,
			0, 0, 0,
			0, 0, 0
		)
	}
}
