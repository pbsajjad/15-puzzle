import { PuzzleBoard } from "./puzzle-board.js";

export class Game {
  #id;
  #puzzleBoards;
  #puzzleBoardsElement;
  #templateElement;

  constructor() {
    this.#id = 1;
    this.#puzzleBoards = new Map();
    this.#puzzleBoardsElement = document.getElementById("puzzle-boards");
    this.#templateElement = document.getElementById("puzzle-board-template");
  }

  init(numberOfRows = 4, numberOfCols = 4, tileSizeInPx = 100) {
    this.#puzzleBoardsElement.innerHTML = "";
    this.addPuzzleBoard(numberOfRows, numberOfCols, tileSizeInPx);
  }

  addPuzzleBoard(numberOfRows, numberOfCols, tileSizeInPx) {
    const id = this.#id++;

    if (this.#templateElement) {
      const boardTemplateElement =
        this.#templateElement.content.cloneNode(true);
      const puzzleBoardElement =
        boardTemplateElement.querySelector(".puzzle-board");
      const titleElement = boardTemplateElement.querySelector(".title");
      const messageBoxElement =
        boardTemplateElement.querySelector(".message-box");
      const puzzleGridElement =
        boardTemplateElement.querySelector(".puzzle-grid");
      const resetElement = boardTemplateElement.querySelector(".reset");

      if (
        puzzleBoardElement &&
        titleElement &&
        messageBoxElement &&
        puzzleGridElement
      ) {
        puzzleBoardElement.dataset.id = id;
        titleElement.textContent = `Board ${numberOfRows}x${numberOfCols}`;

        puzzleBoardElement.appendChild(messageBoxElement);
        puzzleBoardElement.appendChild(puzzleGridElement);
        this.#puzzleBoardsElement.appendChild(puzzleBoardElement);

        const puzzleBoard = new PuzzleBoard(
          numberOfRows,
          numberOfCols,
          tileSizeInPx,
          puzzleGridElement,
          messageBoxElement
        );

        this.#puzzleBoards.set(id, puzzleBoard);
        puzzleBoard.render();

        if (resetElement) {
          resetElement.addEventListener("click", (e) => {
            puzzleBoard.reset();
          });
        }

        return id;
      }
    }
  }

  getPuzzleBoard(id) {
    return this.#puzzleBoards.get(id) || null;
  }

  removePuzzleBoard(id) {
    const puzzleBoardElement = this.#puzzleBoardsElement.querySelector(
      `[data-id="${id}"]`
    );

    this.#puzzleBoards.delete(id);

    if (puzzleBoardElement) {
      puzzleBoardElement.remove();
    }
  }
}
