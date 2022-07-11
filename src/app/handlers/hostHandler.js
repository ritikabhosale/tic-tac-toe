const { Game } = require("../../game");

const hostHandler = games => {
  let gameId = 0;
  return (request, response) => {
    let location = '/login';
    if (request.session) {
      location = '/game';
      const game = new Game(gameId);
      games[gameId] = game;
      game.addPlayer(request.session.email);
      request.session.gameId = gameId;
      gameId++;
    }

    response.statusCode = 302;
    response.setHeader('location', location);
    response.end()

    return;
  };
}

module.exports = { hostHandler };
