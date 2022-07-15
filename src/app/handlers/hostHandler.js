const { Game } = require("../../game");

const hostHandler = games => {
  let gameId = 0;
  return (request, response) => {
    let location = '/login';

    if (request.session) {
      location = '/game';

      const game = new Game(gameId);
      game.addPlayer(request.session.username);

      games[gameId] = game;
      request.session.gameId = gameId;
      gameId++;
    }

    response.redirect(location);
    return;
  };
}

module.exports = { hostHandler };
