const serveGameAPI = games => (request, response) => {
  if (!request.session) {
    response.statusCode = 302;
    response.setHeader('location', '/login');
    response.end();
    return;
  }

  const { gameId } = request.session;
  const game = games[gameId];
  response.setHeader('content-type', 'application/json');
  response.end(game.toJSON());
};

module.exports = { serveGameAPI };
