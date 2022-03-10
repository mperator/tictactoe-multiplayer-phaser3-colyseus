import { Schema, ArraySchema, type } from '@colyseus/schema'
import ITicTacToeState, { GameStates } from '../types/ITicTacToeState';

export default class TicTacToeState extends Schema implements ITicTacToeState {
    @type('number')
    gameState: number = GameStates.WaitingForPlayers;
    
    @type(['number'])
    board: ArraySchema<number>;

    @type('number')
    activePlayer: number = 0;

    @type('number')
    winningPlayer: number = -1;

    constructor() {
        super();

        this.board = new ArraySchema<number>(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        );
    }
}