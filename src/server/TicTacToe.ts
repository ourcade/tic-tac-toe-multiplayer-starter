import { Client, Room } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Message } from '../types/messages'
import TicTacToeState from './TicTacToeState'
import PlayerSelectionCommand from './commands/PlayerSelectionCommand'

export default class TicTacToe extends Room<TicTacToeState>
{
	private dispatcher = new Dispatcher(this)

	onCreate()
	{
		this.setState(new TicTacToeState())

		this.onMessage(Message.PlayerSelection, (client, message: { index: number }) => {
			this.dispatcher.dispatch(new PlayerSelectionCommand(), {
				client,
				index: message.index
			})			
		})
	}
}
