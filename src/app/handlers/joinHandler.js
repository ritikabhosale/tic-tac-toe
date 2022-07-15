const serveJoinForm = (template, fs) => (request, response) => {
  if (!request.session) {
    response.redirect('/login');
    return;
  }
  const form = fs.readFileSync(template, 'utf8');
  response.type('html')
  response.end(form);
  return;
};

const joinHandler = games => (request, response) => {
  const gameId = request.bodyParams['game-id'];
  const game = games[gameId];

  if (!request.session) {
    response.redirect('/login');
    return;
  }

  if (!game.isSpotAvailable()) {
    response.end('Game already has two players.');
    return;
  }

  game.addPlayer(request.session.username);
  request.session.gameId = gameId;
  response.redirect('/game');
  return;
}

module.exports = { joinHandler, serveJoinForm };
