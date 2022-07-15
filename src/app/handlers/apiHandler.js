const isUserInAGame = ({ gameId }) => {
  return gameId !== undefined;
}

const serveGameAPI = games => (request, response) => {
  if (!request.session) {
    response.redirect('/login');
    return;
  }

  if (!isUserInAGame(request.session)) {
    response.status(409);
    response.json({ success: false, message: 'You are not part of any game' });
    return;
  }

  const { gameId } = request.session;
  const game = games[gameId];
  response.setHeader('content-type', 'application/json');
  response.end(game.toJSON());
};

module.exports = { serveGameAPI };
