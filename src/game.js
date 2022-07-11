class Game {
  #board;
  #players;
  #id;
  constructor(id) {
    this.#id = id;
    this.#board = Array(3).fill(Array(3).fill(''));
    this.#players = [];
  }

  getBoard() {
    return this.#board.slice(0);
  }

  addPlayer(playerId) {
    this.#players.push(playerId);
  }

  isSpotAvailable() {
    return this.#players.length < 2;
  }

  get id() {
    return this.#id;
  }

  getMessage() {
    return this.isSpotAvailable() ? 'Waiting for another player' : '';
  }

  toJSON() {
    const game = {
      gameId: this.#id,
      board: this.#board,
      message: this.getMessage()
    }
    return JSON.stringify(game);
  }
}

module.exports = { Game };
