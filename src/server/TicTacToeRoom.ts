import { Room, Client } from 'colyseus'
import { Dispatcher } from '@colyseus/command';
import { Messages } from '../types/Messages';
import TicTacToeState from './TicTacToeState';
import PlayerSelectionCommand from './commands/PlayerSelectionCommand';
import { GameStates } from '../types/ITicTacToeState';

// SERVER

export default class TicTacToeRoom extends Room<TicTacToeState> {
    private dispatcher = new Dispatcher(this);
    
    onCreate() {
        this.maxClients = 2;
        this.setState(new TicTacToeState());

        this.onMessage(Messages.PlayerSelection, (client, message: { index: number}) => {
            this.dispatcher.dispatch(new PlayerSelectionCommand(), {
                client,
                index: message.index
            })
        });
    };

    onJoin(client: Client) {
        const index = this.clients.findIndex(c => c.sessionId === client.sessionId);
        client.send(Messages.PlayerIndex, { playerIndex: index});

        if(this.clients.length >= this.maxClients) {
            this.state.gameState = GameStates.Playing;
        }
    }
}
