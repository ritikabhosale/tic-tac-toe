class Game {
  #board;
  #players;
  #id;
  #lastMoved;
  constructor(id) {
    this.#id = id;
    this.#board = Array(9).fill('');
    this.#players = [];
    this.#lastMoved;
  }

  getBoard() {
    return this.#board.slice(0);
  }

  addPlayer(playerId) {
    let symbol = 'O';
    if (this.#players.length === 0) {
      symbol = 'X';
    }
    const player = { playerId, symbol };

    this.#lastMoved = player;
    this.#players.push(player);
  }

  isSpotAvailable() {
    return this.#players.length < 2;
  }

  get id() {
    return this.#id;
  }

  getMessage() {
    if (this.isSpotAvailable()) {
      return 'Waiting for another player';
    }
    if (this.#hasWon(this.#lastMoved.symbol)) {
      return `${this.#lastMoved.playerId} has won the game.`;
    }
    if (this.#isOver()) {
      return 'It\'s a draw.';
    }
    return '';
  }

  updateGame(cellId, userName) {
    const player = this.#players.find(({ playerId }) => playerId === userName);
    this.#lastMoved = player;
    this.#board[cellId - 1] = player.symbol;
  }

  #hasWon(symbol) {
    const winningMoves = [[1, 4, 7], [0, 3, 6], [3, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8], [2, 4, 6], [0, 4, 8]];
    return winningMoves.some(move => {
      return move.every(cellId => this.#board[cellId] === symbol);
    });
  }

  #allMovesPlayed() {
    return !this.#board.includes('');
  }

  #isOver() {
    return this.#hasWon(this.#lastMoved.symbol) || this.#allMovesPlayed();
  }

  toJSON() {
    const game = {
      gameId: this.#id,
      board: this.#board,
      message: this.getMessage(),
      isOver: this.#isOver()
    }
    return JSON.stringify(game);
  }
}

module.exports = { Game };
