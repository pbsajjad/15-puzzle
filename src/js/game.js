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
    const newBoardFormElement = document.getElementById("new-board-form");
    const addButtonElement = document.getElementById("add-button");

    this.#puzzleBoardsElement.innerHTML = "";
    this.addPuzzleBoard(numberOfRows, numberOfCols, tileSizeInPx);

    if (newBoardFormElement) {
      newBoardFormElement.addEventListener("submit", (event) => {
        event.preventDefault();
        this.#handleAddNewPuzzle.bind(this);
      });
    }

    if (addButtonElement) {
      addButtonElement.addEventListener(
        "click",
        this.#handleAddNewPuzzle.bind(this)
      );
    }
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
      const removeElement = boardTemplateElement.querySelector(".remove");
      const shuffleElement = boardTemplateElement.querySelector(".shuffle");

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

        if (removeElement) {
          removeElement.addEventListener("click", (e) => {
            this.removePuzzleBoard(id);
          });
        }

        if (shuffleElement) {
          shuffleElement.addEventListener("click", (e) => {
            puzzleBoard.shuffle();
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

    if (this.#puzzleBoards.size === 0) {
      const templateElement = document.getElementById("empty-boards-template");

      if (templateElement) {
        const messageTemplateElement = templateElement.content.cloneNode(true);

        this.#puzzleBoardsElement.appendChild(messageTemplateElement);
      }
    }
  }

  #handleAddNewPuzzle() {
    const numberOfRowsInputElement = document.getElementById("number-of-rows");
    const numberOfColsInputElement = document.getElementById("number-of-cols");
    const tileSizeInputElement = document.getElementById("tile-size");
    const emptyBoardsMessageElement = this.#puzzleBoardsElement.querySelector(
      ".empty-boards-message"
    );

    if (
      numberOfRowsInputElement &&
      numberOfColsInputElement &&
      tileSizeInputElement
    ) {
      const numberOfRows = parseInt(numberOfRowsInputElement.value);
      const numberOfCols = parseInt(numberOfColsInputElement.value);
      const tileSizeInPx = parseInt(tileSizeInputElement.value) || 100;

      numberOfRowsInputElement.classList.remove("error");
      numberOfColsInputElement.classList.remove("error");
      tileSizeInputElement.classList.remove("error");

      if (numberOfRows && numberOfCols && tileSizeInPx) {
        if (emptyBoardsMessageElement) {
          this.#puzzleBoardsElement.innerHTML = "";
        }

        const newPuzzleBoardId = this.addPuzzleBoard(
          numberOfRows,
          numberOfCols,
          tileSizeInPx
        );

        if (newPuzzleBoardId) {
          numberOfRowsInputElement.value = "";
          numberOfColsInputElement.value = "";
          tileSizeInputElement.value = "";
        }
      } else {
        if (!numberOfRows) {
          numberOfRowsInputElement.classList.add("error");
        }

        if (!numberOfCols) {
          numberOfColsInputElement.classList.add("error");
        }
      }
    }
  }
}
