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

const gameExists = (games, gameId) => {
  return games[gameId] ? true : false;
};

const joinHandler = games => (request, response) => {
  const gameId = request.body['game-id'];

  if (!request.session) {
    response.redirect('/login');
    return;
  }

  if (!gameExists(games, gameId)) {
    response.status(404);
    response.json({ success: false, message: 'Game doesn\'t exist.' });
    return;
  }

  const game = games[gameId];
  if (!game.isSpotAvailable()) {
    response.status(422);
    response.json({ success: false, message: 'Game already has two players.' });
    return;
  }

  game.addPlayer(request.session.username);
  request.session.gameId = gameId;
  response.redirect('/game');
  return;
}

module.exports = { joinHandler, serveJoinForm };
