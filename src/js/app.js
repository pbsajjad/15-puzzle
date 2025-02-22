import { PuzzleBoard } from "./puzzle-board.js";

const puzzleBoardElement = document.getElementsByClassName("puzzle-grid")[0];
const puzzleBoardMessageElement =
  document.getElementsByClassName("message-box")[0];
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
