import { PuzzleBoard } from "./puzzle-board.js";

const puzzleBoardElement = document.getElementById("puzzle-board");
const NUMBER_OF_ROWS = 2;
const NUMBER_OF_COLS = 3;
const puzzleBoard = new PuzzleBoard(
  NUMBER_OF_ROWS,
  NUMBER_OF_COLS,
  puzzleBoardElement
);

puzzleBoard.init();
