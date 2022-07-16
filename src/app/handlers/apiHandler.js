const gameExists = (games, gameId) => {
  return games[gameId] ? true : false;
};

const serveGameAPI = games => (request, response) => {
  if (!request.session) {
    response.redirect('/login');
    return;
  }

  const { gameId } = request.params;
  if (!gameExists(games, gameId)) {
    response.status(404);
    response.json({ success: false, message: 'Game doesn\'t exist.' });
    return;
  }

  const game = games[gameId];
  response.setHeader('content-type', 'application/json');
  response.end(game.toJSON());
};

module.exports = { serveGameAPI };
