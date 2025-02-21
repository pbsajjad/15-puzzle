import { shuffleNumbers } from "./utils.js";

export class PuzzleBoard {
  #boardSize;
  #puzzleBoardElement;
  #tiles;
  #emptyTileIndex;

  constructor(boardSize, puzzleBoardElement) {
    this.#boardSize = boardSize;
    this.#puzzleBoardElement = puzzleBoardElement;
    this.#tiles = [];
    this.#emptyTileIndex;
  }

  init() {
    this.#tiles = Array.from(
      { length: this.#boardSize * this.#boardSize - 1 },
      (_, i) => i + 1
    );
    this.#tiles.push(0);
    this.#tiles = shuffleNumbers(this.#tiles);
    this.#emptyTileIndex = this.#tiles.indexOf(0);

    this.#puzzleBoardElement.style.setProperty(
      "grid-template-columns",
      `repeat(${this.#boardSize}, 1fr)`
    );
    this.#puzzleBoardElement.style.setProperty(
      "grid-template-rows",
      `repeat(${this.#boardSize}, 1fr)`
    );

    this.#renderBoard();
  }

  #renderBoard() {
    this.#puzzleBoardElement.innerHTML = "";

    this.#tiles.forEach((tile, index) => {
      const tileElement = document.createElement("div");

      tileElement.classList.add("tile");
      tileElement.textContent = tile === 0 ? "" : tile;
      tileElement.role = "button";
      tileElement.tabIndex = 0;
      tileElement.dataset.index = index;

      if (tile === 0) {
        tileElement.classList.add("empty");
      }

      tileElement.addEventListener("click", () => {});
      this.#puzzleBoardElement.appendChild(tileElement);
    });
  }

  #swapTiles(tileIndex) {
    if (this.#tiles?.[tileIndex] && typeof this.#emptyTileIndex === "number") {
      [this.#tiles[tileIndex], this.#tiles[this.#emptyTileIndex]] = [
        this.#tiles[this.#emptyTileIndex],
        this.#tiles[tileIndex],
      ];
      this.#emptyTileIndex = tileIndex;
    }
  }
}
