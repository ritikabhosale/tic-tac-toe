const { Game } = require('../../game.js');
const fs = require('fs');

const loadGame = numOfPlayers => {
  const game = new Game(numOfPlayers);
  return (request, response, next) => {
    request.game = game;
    next();
  };
}

const playGame = optionsTemplate => (request, response) => {
  if (!request.session) {
    response.statusCode = 302;
    response.setHeader('location', '/login');
    response.end();
    return;
  }
  const body = fs.readFileSync(optionsTemplate, 'utf-8');
  response.end(body);
  return;
};

module.exports = { loadGame, playGame };
