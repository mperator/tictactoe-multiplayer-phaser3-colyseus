import Phaser from 'phaser'
import { IGameOverSceneData, IGameSceneData } from './SceneData';
import ITicTacToeState, { CellValues, GameStates } from '../../types/ITicTacToeState';
import type TicTacToeClient from '../services/TicTacToeClient';

export default class GameScene extends Phaser.Scene {
    private server?: TicTacToeClient;
    private cells: { display: Phaser.GameObjects.Rectangle, value: CellValues }[] = [];
    private onGameOver?: (data: IGameOverSceneData) => void

    private gameStateText?: Phaser.GameObjects.Text;

    constructor() {
        super('game');
    }

    async create(data: IGameSceneData) {
        const { server, onGameOver } = data;
        this.server = server;
        this.onGameOver = onGameOver;

        if (!this.server) {
            throw new Error("server instance missing");
        }

        await this.server.join();

        this.server.onceStateChanged(this.createBoard, this);
    }

    private createBoard(state: ITicTacToeState) {
        const { width, height } = this.scale;
        const size = 128;

        let x = (width * 0.5) - size;
        let y = (height * 0.5) - size;
        const tileColor = 0xffffff;

        state.board.forEach((cellState, i) => {
            const cell = this.add.rectangle(x, y, size, size, tileColor)
                .setInteractive()
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                    this.server?.makeSelection(i);
                });

            switch (cellState) {
                case CellValues.X:
                    this.add
                        .star(cell.x, cell.y, 4, 4, 60, 0xff0000)
                        .setAngle(45);
                    break;
                case CellValues.O:
                    this.add
                        .circle(cell.x, cell.y, 50, 0x0000ff);
                    break;
            }

            this.cells.push({ display: cell, value: cellState });

            x += size + 5;
            if ((i + 1) % 3 === 0) {
                y += size + 5;
                x = (width * 0.5) - size;
            }
        });

        if(this.server?.gameState === GameStates.WaitingForPlayers) {
            const width  = this.scale.width;
            this.gameStateText = this.add.text(width * 0.5, 50, 'Waiting for opponents...')
                .setOrigin(0.5);
        }

        this.server?.onBoardChanged(this.handleBoardChanged, this);
        this.server?.onPlayerTurnChanged(this.handlePlayerTurnChanged, this);
        this.server?.onPlayerWon(this.handlePlayerWon, this);
        this.server?.onGameStateChanged(this.handleGameStateChanged, this);
    }

    private handleBoardChanged(newValue: CellValues, index: number) {
        const cell = this.cells[index];
        if (cell.value !== newValue) {
            switch (newValue) {
                case CellValues.X:
                    this.add
                        .star(cell.display.x, cell.display.y, 4, 4, 60, 0xff0000)
                        .setAngle(45);
                    break;
                case CellValues.O:
                    this.add
                        .circle(cell.display.x, cell.display.y, 50, 0x0000ff);
                    break;
            }
            cell.value = newValue;
        }
    }

    private handlePlayerTurnChanged(playerIndex: number) {
        console.log(playerIndex, "INDEX");
    }

    private handlePlayerWon(playerIndex: number) {
        this.time.delayedCall(1000, () => {
            if(!this.onGameOver) return;

            this.onGameOver({
                winner: this.server?.playerIndex === playerIndex
            });
        });
    }

    private handleGameStateChanged(state: GameStates) {
        if(state === GameStates.Playing && this.gameStateText) {
            this.gameStateText.destroy();
            this.gameStateText = undefined;
        }
    }
}