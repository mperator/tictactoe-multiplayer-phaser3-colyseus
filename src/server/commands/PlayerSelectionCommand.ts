import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { CellValues, GameStates } from '../../types/ITicTacToeState';
import TicTacToeRoom from '../TicTacToeRoom';
import CheckWinnerCommand from './CheckWinnerCommand';

type Payload = {
    client: Client
    index: number
};

export default class PlayerSelectionCommand extends Command<TicTacToeRoom, Payload> {
    execute(data: Payload) {
        const { client, index } = data;

        if(this.room.state.gameState !== GameStates.Playing)
            return;

        const clientIndex = this.room.clients.findIndex(c => c.id === client.id);

        if(clientIndex !== this.room.state.activePlayer) {
            return;
        }

        const cellValue = clientIndex === 0 ? CellValues.X : CellValues.O;

        if(this.room.state.board[index] === CellValues.Empty) {
            this.room.state.board[index] = cellValue;
            return [new CheckWinnerCommand()];
        }

        return [];
    }
}