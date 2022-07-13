class Game {
  #board;
  #players;
  #id;
  #lastMovedPlayer;
  constructor(id) {
    this.#id = id;
    this.#board = Array(9).fill('');
    this.#players = [];
    this.#lastMovedPlayer;
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
    this.#lastMovedPlayer = player;
    this.#players.push(player);
  }

  isSpotAvailable() {
    return this.#players.length < 2;
  }

  get id() {
    return this.#id;
  }

  updateGame(cellId, currentPlayerId) {
    const currentPlayer = this.#players.find(({ playerId }) =>
      playerId === currentPlayerId);
    if (currentPlayerId !== this.#lastMovedPlayer.playerId) {
      this.#board[cellId - 1] = currentPlayer.symbol;
      this.#lastMovedPlayer = currentPlayer;
    }
  }

  #isMatch(moves, symbol) {
    return moves.every(cell => this.#board[cell] === symbol);
  }

  #getWinner() {
    const winningMoves = [[1, 4, 7], [0, 3, 6], [3, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8], [2, 4, 6], [0, 4, 8]];
    for (let index = 0; index < winningMoves.length; index++) {
      if (this.#isMatch(winningMoves[index], 'X')) {
        return this.#players[0];
      }
      if (this.#isMatch(winningMoves[index], 'O')) {
        return this.#players[1];
      }
    }
    return null;
  }

  #isDrawn() {
    return !this.#board.includes('');
  }

  #isOver() {
    return this.#getWinner() ? true : false || this.#isDrawn();
  }

  toJSON() {
    const result = {
      isOver: this.#isOver()
    }
    if (this.#isOver()) {
      result.draw = this.#isDrawn();
    }
    if (this.#getWinner()) {
      result.winner = this.#getWinner();
    }

    const game = {
      gameId: this.#id,
      board: this.#board,
      ready: !this.isSpotAvailable(),
      result
    };
    return JSON.stringify(game);
  }
}

module.exports = { Game };
