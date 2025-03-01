import { getTileFontSizeInPx, shuffleNumbers } from "./utils.js";

export class PuzzleBoard {
  #numberOfRows;
  #numberOfCols;
  #tileSizeInPx;
  #puzzleBoardElement;
  #puzzleBoardMessageElement;
  #tiles;
  #originalTiles;
  #emptyTileIndex;
  #originalEmptyTileIndex;
  #totalMoves;
  static TILE_FONT_RATIO = 2.6;
  static TILES_GAP_IN_PX = 5;

  constructor(
    numberOfRows,
    numberOfCols,
    tileSizeInPx,
    puzzleBoardElement,
    puzzleBoardMessageElement
  ) {
    this.#numberOfRows = numberOfRows || 4;
    this.#numberOfCols = numberOfCols || 4;
    this.#tileSizeInPx = tileSizeInPx || 100;
    this.#puzzleBoardElement = puzzleBoardElement;
    this.#puzzleBoardMessageElement = puzzleBoardMessageElement;
    this.#tiles = [];
    this.#totalMoves = 0;

    this.#init();
  }

  #init() {
    // Prevent generating unsolvable or completed puzzle
    do {
      this.#tiles = Array.from(
        { length: this.#numberOfRows * this.#numberOfCols - 1 },
        (_, i) => i + 1
      );
      this.#tiles.push(0);
      this.#tiles = shuffleNumbers(this.#tiles);
      this.#emptyTileIndex = this.#tiles.indexOf(0);

      // Keep a copy of tiles and emptyTileIndex for resetting board
      this.#originalTiles = [...this.#tiles];
      this.#originalEmptyTileIndex = this.#emptyTileIndex;
    } while (!this.#isBoardSolvable(this.#tiles) || this.#hasWon());
  }

  render() {
    const fragment = document.createDocumentFragment();
    const boardMaxWidth =
      this.#numberOfCols * this.#tileSizeInPx +
      (this.#numberOfCols - 1) * PuzzleBoard.TILES_GAP_IN_PX;
    const boardMaxHeight =
      this.#numberOfRows * this.#tileSizeInPx +
      (this.#numberOfRows - 1) * PuzzleBoard.TILES_GAP_IN_PX;

    this.#puzzleBoardElement.innerHTML = "";
    this.#puzzleBoardElement.style.setProperty(
      "grid-template-rows",
      `repeat(${this.#numberOfRows}, minmax(0, 1fr))`
    );
    this.#puzzleBoardElement.style.setProperty(
      "grid-template-columns",
      `repeat(${this.#numberOfCols}, minmax(0, 1fr))`
    );
    this.#puzzleBoardElement.style.setProperty(
      "max-width",
      `${boardMaxWidth}px`
    );
    this.#puzzleBoardElement.style.setProperty(
      "max-height",
      `${boardMaxHeight}px`
    );
    this.#puzzleBoardElement.addEventListener(
      "click",
      this.#handleMoveTile.bind(this)
    );
    this.#puzzleBoardElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.#handleMoveTile(event);
      }
    });

    const puzzleBoardElementWidth = this.#puzzleBoardElement.clientWidth;

    this.#tiles?.forEach((tile, index) => {
      const tileElement = document.createElement("div");

      tileElement.classList.add("tile");
      tileElement.textContent = tile === 0 ? "" : tile;
      tileElement.style.setProperty("max-width", `${this.#tileSizeInPx}px`);
      tileElement.style.setProperty("max-height", `${this.#tileSizeInPx}px`);
      tileElement.style.setProperty(
        "font-size",
        getTileFontSizeInPx(puzzleBoardElementWidth / this.#numberOfCols)
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

      fragment.appendChild(tileElement);
    });

    this.#puzzleBoardElement.appendChild(fragment);
  }

  reset() {
    this.#totalMoves = 0;
    this.#tiles = [...this.#originalTiles];
    this.#emptyTileIndex = this.#originalEmptyTileIndex;

    this.render();
    this.#renderResetMessage();
  }

  shuffle() {
    this.#totalMoves = 0;

    this.#init();
    this.render();
    this.#renderResetMessage();
  }

  /**
   * Check the generated puzzle grid is solvable or not.
   * It would be done with considering total count of inversions, odd or even columns, & empty tile position.
   * If the number of columns is odd, then the inversions should be even.
   * If the number of columns is even, then the empty tile row number (counting from bottom) come into play:
   * If it's even, the inversions should be odd, and vice versa.
   * @returns {Boolean} solvable status (true or false).
   */
  #isBoardSolvable() {
    const inversions = this.#getTotalInversions(this.#tiles);

    if (this.#numberOfCols % 2 !== 0) {
      return inversions % 2 === 0;
    } else {
      const emptyTileRowIndex = this.#getEmptyTileRowIndex();
      const emptyTileRowNoFromBottom = this.#numberOfRows - emptyTileRowIndex;

      return emptyTileRowNoFromBottom % 2 === 0
        ? inversions % 2 !== 0
        : inversions % 2 === 0;
    }
  }

  #swapTiles(tileIndex) {
    if (
      this.#tiles?.[tileIndex] &&
      typeof this.#emptyTileIndex === "number" &&
      !this.#hasWon()
    ) {
      // Get candidate elements for swapping
      const emptyTileElement = this.#puzzleBoardElement.querySelector(".empty");
      const targetTileElement = this.#puzzleBoardElement.querySelector(
        `[data-index="${tileIndex}"]`
      );
      const targetTileNo = targetTileElement.textContent;

      // Swap their content and styles with each other
      emptyTileElement.textContent = targetTileNo;
      emptyTileElement.classList.remove("empty");

      if (this.#emptyTileIndex + 1 == +targetTileNo) {
        emptyTileElement.classList.add("done");
      }

      targetTileElement.textContent = "";
      targetTileElement.classList.add("empty");
      targetTileElement.classList.remove("done");

      [this.#tiles[tileIndex], this.#tiles[this.#emptyTileIndex]] = [
        this.#tiles[this.#emptyTileIndex],
        this.#tiles[tileIndex],
      ];
      this.#emptyTileIndex = tileIndex;

      this.#increaseTotalMoves();
    }
  }

  #getTilesAdjacentToEmptySlot() {
    if (
      typeof this.#emptyTileIndex !== "number" ||
      !this.#numberOfRows ||
      this.#numberOfRows < 0 ||
      !this.#numberOfCols ||
      this.#numberOfCols < 0
    ) {
      return [];
    }

    const emptyTileRowIndex = this.#getEmptyTileRowIndex();
    const emptyTileColumnIndex = this.#getEmptyTileColIndex();
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

  #handleMoveTile(event) {
    if (event?.target) {
      const tileIndex = parseInt(event.target?.dataset?.index || "-1");
      const possibleMoves = this.#getTilesAdjacentToEmptySlot();

      if (possibleMoves?.includes(tileIndex)) {
        this.#swapTiles(tileIndex);

        if (this.#hasWon()) {
          this.#renderWonMessage();
        }
      }
    }
  }

  #hasWon() {
    for (let i = 0; i < this.#tiles.length; i++) {
      // Skip empty tile checking in the first condition
      if (this.#tiles?.[i] > 0 && this.#tiles?.[i] !== i + 1) {
        return false;
      }
    }

    return true;
  }

  #increaseTotalMoves() {
    this.#totalMoves++;
    this.#renderTotalMovesMessage();
  }

  #getEmptyTileRowIndex() {
    return Math.floor(this.#emptyTileIndex / this.#numberOfCols);
  }

  #getEmptyTileColIndex() {
    return this.#emptyTileIndex % this.#numberOfCols;
  }

  #getTotalInversions(tilesArray) {
    const tiles = [...(tilesArray || [])];
    const tilesLength = tiles.length;
    let inversions = 0;

    for (let i = 0; i < tilesLength; i++) {
      // Exclude counting empty tile in inversions
      if (tiles?.[i] === 0) {
        continue;
      }

      for (let j = i + 1; j < tilesLength; j++) {
        if (tiles?.[i] && tiles?.[j] && tiles[i] > tiles[j]) {
          inversions++;
        }
      }
    }

    return inversions;
  }

  #renderTotalMovesMessage() {
    const content = `You've moved ${this.#totalMoves} ${
      this.#totalMoves > 1 ? "tiles" : "tile"
    }!`;

    this.#renderMessage(content);
  }

  #renderWonMessage() {
    const content = `Congrats! You completed the game with ${
      this.#totalMoves
    } ${this.#totalMoves > 1 ? "moves" : "move"}!`;

    this.#renderMessage(content, "success");
  }

  #renderResetMessage() {
    const content = "Start moving...";

    this.#renderMessage(content);
  }

  #renderMessage(content, type) {
    if (content) {
      this.#puzzleBoardMessageElement.textContent = content;
      this.#puzzleBoardMessageElement.className = "";
      this.#puzzleBoardMessageElement.classList.add("message");

      switch (type) {
        case "success":
          this.#puzzleBoardMessageElement.classList.add("success");
          break;
        default:
          break;
      }
    }
  }
}
