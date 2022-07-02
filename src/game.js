class Game {
  #numOfPlayers;
  #board;
  constructor(numOfPlayers) {
    this.#numOfPlayers = numOfPlayers;
    this.#board = Array(3).fill(Array(3).fill(''));
  }

  getBoard() {
    return this.#board;
  }

  gameReady() {
    return this.#numOfPlayers < 1;
  }

  addPlayer() {
    this.#numOfPlayers--;
  }
}

module.exports = { Game };
