const gameHandler = (boardTemplate, fs) => (request, response) => {
  const gamePage = fs.readFileSync(boardTemplate, 'utf8');
  response.end(gamePage);
};

const registerMove = games => (request, response) => {
  const { gameId, email } = request.session;
  const { id } = request.bodyParams;
  const game = games[gameId];
  game.updateGame(id, email);
  response.end();
};

module.exports = { gameHandler, registerMove };
