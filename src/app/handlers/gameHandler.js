const getGamePage = (fs = require('fs')) => {
  return fs.readFileSync('./src/app/template/board.html', 'utf8');
};

const gameHandler = (request, response) => {
  const gamePage = getGamePage();
  response.end(gamePage);
};

const registerMove = games => (request, response) => {
  const { gameId, email } = request.session;
  const { id } = request.bodyParams;
  const game = games[gameId];
  game.updateGame(id, email);
  response.end();
};

module.exports = { gameHandler, registerMove };
