import TicTacToeClient from '../services/TicTacToeClient';
import Phaser from 'phaser'
import { IGameOverSceneData } from './SceneData';

export default class BootstrapScene extends Phaser.Scene {
    private server!: TicTacToeClient;

    constructor() {
        super('bootstrap');
    }

    init() {
        this.server = new TicTacToeClient();
    }

    create() {
        this.createNewGame();
    }

    private handleGameOver = (data: IGameOverSceneData) => {
        this.server.leave();
        this.scene.stop('game');
        this.scene.launch('game-over', {
            ...data,
            onRestart: this.handleRestart
        });
    }

    private handleRestart = () => {
        this.scene.stop('game-over');
        this.createNewGame();
    }

    private createNewGame() {
        this.scene.launch('game', {
            server: this.server,
            onGameOver: this.handleGameOver
        });
    }
}
