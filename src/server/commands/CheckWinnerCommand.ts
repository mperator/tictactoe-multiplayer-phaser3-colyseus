import { Command } from "@colyseus/command";
import { CellValues } from "../../types/ITicTacToeState";
import TicTacToeRoom from "../TicTacToeRoom";
import NextTurnCommand from "./NextTurnCommand";

export default class CheckWinnerCommand extends Command<TicTacToeRoom> {
    private determineWin(cellValue: CellValues) {
        const board = this.state.board;

        if ((board[0] === cellValue && board[1] === cellValue && board[2] === cellValue) ||
            (board[3] === cellValue && board[4] === cellValue && board[5] === cellValue) ||
            (board[6] === cellValue && board[7] === cellValue && board[8] === cellValue) ||
            (board[0] === cellValue && board[3] === cellValue && board[6] === cellValue) ||
            (board[1] === cellValue && board[4] === cellValue && board[7] === cellValue) ||
            (board[2] === cellValue && board[5] === cellValue && board[8] === cellValue) ||
            (board[0] === cellValue && board[4] === cellValue && board[8] === cellValue) ||
            (board[2] === cellValue && board[4] === cellValue && board[6] === cellValue))
            return true;

        return false;
    }

    execute() {
        const winnerO = this.determineWin(CellValues.O);
        const winnerX = this.determineWin(CellValues.X);

        if (winnerO || winnerX) {
            this.state.winningPlayer = this.state.activePlayer;
        } else {
            return [new NextTurnCommand()]
        }
    }
}