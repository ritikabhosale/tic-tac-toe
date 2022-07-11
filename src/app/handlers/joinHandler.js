const fs = require('fs');

const serveJoinForm = template => (request, response) => {
  const form = fs.readFileSync(template, 'utf8');
  response.end(form);
  return;
};

const joinHandler = games => (request, response) => {
  const gameId = request.bodyParams['game-id'];
  const game = games[gameId];
  if (!game.isSpotAvailable()) {
    response.end('Game already has two players.');
    return;
  }
  game.addPlayer(request.session.email);
  request.session.gameId = gameId;
  response.setHeader('location', '/game');
  response.statusCode = 302;
  response.end();
  return;
}

module.exports = { joinHandler, serveJoinForm };
