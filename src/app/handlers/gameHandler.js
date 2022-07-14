const gameHandler = (boardTemplate, fs) => (request, response) => {
  const gamePage = fs.readFileSync(boardTemplate, 'utf8');
  response.setHeader('content-type', 'text/html');
  response.end(gamePage);
};

const registerMove = games => (request, response) => {
  const { gameId, username } = request.session;
  const { id } = request.bodyParams;
  const game = games[gameId];
  game.updateGame(id, username);
  response.end();
};

module.exports = { gameHandler, registerMove };
