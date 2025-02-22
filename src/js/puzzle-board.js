import { shuffleNumbers } from "./utils.js";

export class PuzzleBoard {
  #numberOfRows;
  #numberOfCols;
  #tileSizeInPx;
  #puzzleBoardElement;
  #tiles;
  #emptyTileIndex;
  static TILE_FONT_RATIO = 2.6;

  constructor(numberOfRows, numberOfCols, tileSizeInPx, puzzleBoardElement) {
    this.#numberOfRows = numberOfRows || 4;
    this.#numberOfCols = numberOfCols || 4;
    this.#tileSizeInPx = tileSizeInPx || 100;
    this.#puzzleBoardElement = puzzleBoardElement;
    this.#tiles = [];
    this.#emptyTileIndex;
  }

  init() {
    this.#tiles = Array.from(
      { length: this.#numberOfRows * this.#numberOfCols - 1 },
      (_, i) => i + 1
    );
    this.#tiles.push(0);
    this.#tiles = shuffleNumbers(this.#tiles);
    this.#emptyTileIndex = this.#tiles.indexOf(0);

    this.#puzzleBoardElement.style.setProperty(
      "grid-template-rows",
      `repeat(${this.#numberOfRows}, 1fr)`
    );
    this.#puzzleBoardElement.style.setProperty(
      "grid-template-columns",
      `repeat(${this.#numberOfCols}, 1fr)`
    );

    this.#renderBoard();
  }

  #renderBoard() {
    this.#puzzleBoardElement.innerHTML = "";

    this.#tiles.forEach((tile, index) => {
      const tileElement = document.createElement("div");

      tileElement.classList.add("tile");
      tileElement.textContent = tile === 0 ? "" : tile;
      tileElement.style.setProperty("width", `${this.#tileSizeInPx}px`);
      tileElement.style.setProperty("height", `${this.#tileSizeInPx}px`);
      tileElement.style.setProperty(
        "font-size",
        `${this.#tileSizeInPx / PuzzleBoard.TILE_FONT_RATIO}px`
      );
      tileElement.role = "button";
      tileElement.tabIndex = 0;
      tileElement.dataset.index = index;

      if (tile === 0) {
        tileElement.classList.add("empty");
      }

      if (index + 1 === tile) {
        tileElement.classList.add("done");
      }

      if (tile > 0) {
        tileElement.addEventListener("click", this.#moveTile.bind(this));
      }

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

  #getAdjacentTilesForEmptySlot() {
    if (
      typeof this.#emptyTileIndex !== "number" ||
      !this.#numberOfRows ||
      this.#numberOfRows < 0 ||
      !this.#numberOfCols ||
      this.#numberOfCols < 0
    ) {
      return [];
    }

    const emptyTileRowIndex = Math.floor(
      this.#emptyTileIndex / this.#numberOfCols
    );
    const emptyTileColumnIndex = this.#emptyTileIndex % this.#numberOfCols;
    const possibleMoves = [];

    if (emptyTileRowIndex > 0) {
      possibleMoves.push(this.#emptyTileIndex - this.#numberOfCols);
    }

    if (emptyTileRowIndex < this.#numberOfRows - 1) {
      possibleMoves.push(this.#emptyTileIndex + this.#numberOfCols);
    }

    if (emptyTileColumnIndex > 0) {
      possibleMoves.push(this.#emptyTileIndex - 1);
    }

    if (emptyTileColumnIndex < this.#numberOfCols - 1) {
      possibleMoves.push(this.#emptyTileIndex + 1);
    }

    return possibleMoves;
  }

  #moveTile(event) {
    if (event?.target) {
      const tileIndex = parseInt(event.target?.dataset?.index || "-1");
      const possibleMoves = this.#getAdjacentTilesForEmptySlot();

      if (possibleMoves?.includes(tileIndex)) {
        this.#swapTiles(tileIndex);
        this.#renderBoard();
      }
    }
  }
}
