import { PuzzleBoard } from "./puzzle-board.js";

const puzzleBoardElement = document.getElementById("puzzle-board");
const BOARD_SIZE = 4;
const puzzleBoard = new PuzzleBoard(BOARD_SIZE, puzzleBoardElement);

puzzleBoard.init();
