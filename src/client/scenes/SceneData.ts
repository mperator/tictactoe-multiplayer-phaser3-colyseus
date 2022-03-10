import TicTacToeClient from "../services/TicTacToeClient"

export interface IGameOverSceneData {
    winner: boolean
    onRestart?: () => void;
}

export interface IGameSceneData {
    server: TicTacToeClient,
    onGameOver: (data: IGameOverSceneData) => void
}