const isUserInAGame = ({ gameId }) => {
  return gameId !== undefined;
};

const gameHandler = (boardTemplate, fs) => (request, response) => {
  if (!request.session) {
    response.redirect('/login');
    return;
  }

  const gamePage = fs.readFileSync(boardTemplate, 'utf8');
  response.type('html')
  response.end(gamePage);
};

const registerMove = games => (request, response) => {
  if (!request.session) {
    response.redirect('/login');
    return;
  }

  if (isUserInAGame(request.session)) {
    const { gameId, username } = request.session;
    const { id } = request.body;
    const game = games[gameId];
    game.updateGame(id, username);
  }

  response.end();
};

module.exports = { gameHandler, registerMove };
