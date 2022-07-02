const { Game } = require('../../game.js');
const fs = require('fs');

const generateCell = symbol => `<div class="cell">${symbol}</div>`;

const generateRow = symbols => {
  const row = symbols.map(symbol => generateCell(symbol));
  return `<div class="row">${row.join('')}</div>`;
};

const generateBoard = (board) => {
  return board.map(row => generateRow(row)).join('');
};

const loadGame = numOfPlayers => {
  const game = new Game(numOfPlayers);
  return (request, response, next) => {
    request.game = game;
    next();
  };
}

const play = (request, response) => {
  let message = '';
  request.game.addPlayer();
  if (!request.game.gameReady()) {
    message = 'Waiting for 1 player to join...';
  }
  const board = request.game.getBoard();
  const boardHTML = generateBoard(board);
  const content = fs.readFileSync('./src/app/template/board.html', 'utf8');
  response.end(content.replace('_ROWS_', boardHTML).replace('_MESSAGE_', message));
  return;
};

module.exports = { loadGame, play };
