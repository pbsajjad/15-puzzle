import { PuzzleBoard } from "./puzzle-board.js";

const puzzleBoardElement = document.getElementById("puzzle-board");
const puzzleBoardMessageElement = document.getElementById(
  "puzzle-board-message"
);
const NUMBER_OF_ROWS = 3;
const NUMBER_OF_COLS = 3;
const TILE_SIZE_IN_PX = 100;
const puzzleBoard = new PuzzleBoard(
  NUMBER_OF_ROWS,
  NUMBER_OF_COLS,
  TILE_SIZE_IN_PX,
  puzzleBoardElement,
  puzzleBoardMessageElement
);

puzzleBoard.init();
