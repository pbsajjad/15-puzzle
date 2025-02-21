import { shuffleNumbers } from "./utils.js";

export class PuzzleBoard {
  constructor(boardSize, puzzleBoardElement) {
    this.boardSize = boardSize;
    this.puzzleBoardElement = puzzleBoardElement;
    this.tileNumbers = [];
    this.emptyTileIndex;
  }

  init() {
    this.tileNumbers = Array.from(
      { length: this.boardSize * this.boardSize - 1 },
      (_, i) => i + 1
    );
    this.tileNumbers.push(0);
    this.tileNumbers = shuffleNumbers(this.tileNumbers);
    this.emptyTileIndex = this.tileNumbers.indexOf(0);

    this.puzzleBoardElement.style.setProperty(
      "grid-template-columns",
      `repeat(${this.boardSize}, 1fr)`
    );
    this.puzzleBoardElement.style.setProperty(
      "grid-template-rows",
      `repeat(${this.boardSize}, 1fr)`
    );

    this.renderBoard();
  }

  renderBoard() {
    this.puzzleBoardElement.innerHTML = "";

    this.tileNumbers.forEach((tileNumber, index) => {
      const tileElement = document.createElement("div");

      tileElement.classList.add("tile");
      tileElement.textContent = tileNumber === 0 ? "" : tileNumber;
      tileElement.role = "button";
      tileElement.tabIndex = 0;
      tileElement.dataset.id = index;

      if (tileNumber === 0) {
        tileElement.classList.add("empty");
      }

      tileElement.addEventListener("click", () => {});
      this.puzzleBoardElement.appendChild(tileElement);
    });
  }
}
