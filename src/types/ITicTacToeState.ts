import { Schema, ArraySchema } from '@colyseus/schema'

export enum Cell { Empty, X, O };

export enum GameState { WaitingForPlayers, Playing, Finished };

export interface ITicTacToeState extends Schema {
    board: ArraySchema<number>,
    activePlayer: number,
    winningPlayer: number,
    gameState: number
}

export default ITicTacToeState;