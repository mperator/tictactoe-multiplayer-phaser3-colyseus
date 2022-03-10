import { Client, Room } from 'colyseus.js'
import Phaser from 'phaser';
import ITicTacToeState, { Cell, GameState } from '../../types/ITicTacToeState';
import { Messages } from '../../types/Messages';

export default class Server {

    private client: Client;
    private events: Phaser.Events.EventEmitter;

    private room?: Room<ITicTacToeState>;
    private _playerIndex: number = -1;

    get playerIndex() {
        return this._playerIndex;
    }

    get gameState() {
        if (!this.room) {
            return GameState.WaitingForPlayers;
        }

        return this.room?.state.gameState;
    }

    constructor() {
        this.client = new Client('ws://localhost:2567');
        this.events = new Phaser.Events.EventEmitter();
    }

    async join() {
        this.room = await this.client.joinOrCreate<ITicTacToeState>('tic-tac-toe');

        this.room.onMessage(Messages.PlayerIndex, (message: { playerIndex: number }) => {
            this._playerIndex = message.playerIndex;
        });

        this.room.onStateChange.once(state => {
            this.events.emit('once-state-changed', state);
        });

        this.room.state.onChange = (changes) => {
            changes.forEach(change => {
                const { field, value } = change;

                console.log('value', field, value)

                switch (field) {
                    // case 'board':
                    //     console.log('hello')
                    //     this.events.emit('board-changed', value);
                    //     break;

                    case 'activePlayer':
                        this.events.emit('player-turn-changed', value);
                        break;

                    case 'winningPlayer':
                        this.events.emit('player-won', value);
                        break;

                    case 'gameState':
                        this.events.emit('game-state-changed', value);
                        break;
                }
            });
        };

        this.room.state.board.onChange = (item, index) => {
            this.events.emit('board-changed', item, index);
        }
    }

    leave() {
        this.room?.leave();
        this.events.removeAllListeners();
    }

    makeSelection(index: number) {
        if (!this.room) {
            return;
        }

        if(this.room.state.gameState !== GameState.Playing) {
            return;
        }

        if (this.playerIndex !== this.room.state.activePlayer) {
            console.log("Not you turn.");
            return;
        }

        this.room.send(Messages.PlayerSelection, { index });
    }

    onceStateChanged(callback: (state: ITicTacToeState) => void, context?: any) {
        this.events.once('once-state-changed', callback, context);
    }

    onBoardChanged(callback: (cell: Cell, index: number) => void, context?: any) {
        this.events.on('board-changed', callback, context);
    }

    onPlayerTurnChanged(callback: (playerIndex: number) => void, context?: any) {
        this.events.on('player-turn-changed', callback, context);
    }

    onPlayerWon(callback: (playerIndex: number) => void, context?: any) {
        this.events.on('player-won', callback, context);
    }

    onGameStateChanged(callback: (gameState: GameState) => void, context?: any) {
        this.events.on('game-state-changed', callback, context);
    }
}