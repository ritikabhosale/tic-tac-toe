class Game {
  #board;
  #players;
  #id;
  #currentPlayer;
  constructor(id) {
    this.#id = id;
    this.#board = Array(9).fill('');
    this.#players = [];
    this.#currentPlayer;
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

    this.#currentPlayer = player;
    this.#players.push(player);
  }

  isSpotAvailable() {
    return this.#players.length < 2;
  }

  get id() {
    return this.#id;
  }

  getMessage() {
    const winner = this.#getWinner();

    if (this.isSpotAvailable()) {
      return 'Waiting for another player';
    }
    if (winner) {
      return `${winner.playerId} has won the game.`;
    }
    if (this.#isOver()) {
      return 'It\'s a draw.';
    }
    return '';
  }

  updateGame(cellId, userName) {
    const player = this.#players.find(({ playerId }) => playerId === userName);
    if (userName !== this.#currentPlayer.playerId) {
      this.#board[cellId - 1] = player.symbol;
      this.#currentPlayer = player;
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

  #allMovesPlayed() {
    return !this.#board.includes('');
  }

  #isOver() {
    return this.#getWinner() || this.#allMovesPlayed();
  }

  toJSON() {
    const winner = this.#getWinner();

    const game = {
      gameId: this.#id,
      board: this.#board,
      message: this.getMessage(),
      isOver: this.#isOver(),
    };
    if (winner) {
      game.winner = winner;
    }
    return JSON.stringify(game);
  }
}

module.exports = { Game };
