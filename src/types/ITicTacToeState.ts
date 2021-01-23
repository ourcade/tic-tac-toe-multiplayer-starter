export enum Cell
{
	Empty,
	X,
	O
}

export interface ITicTacToeState
{
	board: Cell[]

	activePlayer: number
}

export default ITicTacToeState
